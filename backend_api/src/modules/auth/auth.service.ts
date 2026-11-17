import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthModel, IUser } from './auth.model';
import crypto from 'crypto';
import {
  RegisterDTO,
  VerifyRegisterDTO,
  LoginEmailDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  AuthResponseDTO,
  toUserResponseDTO
} from './auth.dto';
import { sendEmailOTP } from '../../shared/utils/mailer';
import { sendSmsOtp } from '../../shared/utils/sms';


const DEFAULT_ROLE_ID = 3; // Mặc định là học sinh (student)

const generateOTP = (): string => Math.floor(100000 + Math.random() * 900000).toString();

const signToken = (user: IUser): string => {
  const secretKey = process.env.JWT_SECRET || 'erm6_jwt_secret_key_2026_authentication';
  return jwt.sign(
    { userId: user.id, roleId: user.role_id, email: user.email, phoneNumber: user.phone_number },
    secretKey,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
  );
};

const createAndSaveOTP = async (target: string, purpose: 'REGISTER' | 'RESET_PASSWORD' | 'PHONE_LOGIN') => {
  const otpCode = generateOTP();
  const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
  await AuthModel.invalidateOldOtps(target, purpose);
  await AuthModel.createOtp(target, otpCode, purpose, expireAt);
  return otpCode;
};

const verifyAndConsumeOTP = async (target: string, inputOtp: string, purpose: string) => {
  const activeOtp = await AuthModel.findLatestActiveOtp(target, purpose);
  if (!activeOtp) {
    throw new Error('Mã OTP không tồn tại hoặc đã hết hạn!');
  }

  if (activeOtp.otp_code !== inputOtp) {
    await AuthModel.incrementOtpAttempts(activeOtp.id);
    const remaining = 5 - (activeOtp.attempts + 1);
    throw new Error(
      remaining > 0
        ? `Mã OTP không chính xác! Bạn còn ${remaining} lần thử.`
        : 'Bạn đã nhập sai OTP quá 5 lần. Vui lòng yêu cầu gửi lại mã mới!'
    );
  }

  await AuthModel.markOtpAsUsed(activeOtp.id);
};

export const AuthService = {
  // 1A. Đăng ký & Gửi OTP Email
  async register(dto: RegisterDTO) {
    const rawPassword = dto.password || dto.passwordhash;
    const fullName = dto.fullName || dto.fullname;
    const roleId = dto.roleId || dto.roleid || DEFAULT_ROLE_ID;

    if (!rawPassword) {
      throw new Error('Mật khẩu không được để trống!');
    }
    if (!fullName) {
      throw new Error('Họ tên không được để trống!');
    }

    const existing = await AuthModel.findUserByEmail(dto.email);
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    if (existing) {
      if (existing.is_active) {
        throw new Error('Email này đã được đăng ký và kích hoạt!');
      }
      await AuthModel.updateUnverifiedUser(dto.email, passwordHash, fullName, roleId);
    } else {
      await AuthModel.createUserWithEmail(dto.email, passwordHash, fullName, roleId);
    }

    const otp = await createAndSaveOTP(dto.email, 'REGISTER');
    await sendEmailOTP(dto.email, otp, 'Kích hoạt tài khoản ERM-6');
    return { message: 'Mã OTP đã được gửi tới email của bạn. Vui lòng xác thực để kích hoạt tài khoản.' };
  },

  // 1B. Xác thực OTP kích hoạt tài khoản
  async verifyRegisterOTP(dto: VerifyRegisterDTO): Promise<AuthResponseDTO> {
    await verifyAndConsumeOTP(dto.email, dto.otp, 'REGISTER');
    const user = await AuthModel.activateUserByEmail(dto.email);
    if (!user) {
      throw new Error('Kích hoạt tài khoản không thành công. Người dùng không tồn tại!');
    }
    return { user: toUserResponseDTO(user), token: signToken(user) };
  },

  // 2. Đăng nhập bằng Email & Mật khẩu
  async loginWithEmail(dto: LoginEmailDTO): Promise<AuthResponseDTO> {
    const rawPassword = dto.password || dto.passwordhash;
    if (!rawPassword) {
      throw new Error('Vui lòng nhập mật khẩu!');
    }

    const user = await AuthModel.findUserByEmail(dto.email);
    if (!user) throw new Error('Email hoặc mật khẩu không chính xác!');
    if (!user.is_active) throw new Error('Tài khoản chưa được kích hoạt. Vui lòng xác thực OTP qua email!');
    if (!user.password_hash) throw new Error('Tài khoản chưa thiết lập mật khẩu!');

    const isMatch = await bcrypt.compare(rawPassword, user.password_hash);
    if (!isMatch) throw new Error('Email hoặc mật khẩu không chính xác!');

    return { user: toUserResponseDTO(user), token: signToken(user) };
  },

  // 3A. Quên mật khẩu: Gửi OTP qua Email
  async forgotPassword(dto: ForgotPasswordDTO) {
    const user = await AuthModel.findUserByEmail(dto.email);
    if (!user) throw new Error('Email không tồn tại trong hệ thống!');

    const otp = await createAndSaveOTP(dto.email, 'RESET_PASSWORD');
    await sendEmailOTP(dto.email, otp, 'Khôi phục mật khẩu ERM-6');
    return { message: 'Mã OTP đặt lại mật khẩu đã được gửi tới email của bạn.' };
  },

  // 3B. Quên mật khẩu: Xác thực OTP & Đổi mật khẩu mới
  async resetPassword(dto: ResetPasswordDTO) {
    const newPassword = dto.newPassword || dto.newpassword;
    if (!newPassword) {
      throw new Error('Vui lòng nhập mật khẩu mới!');
    }

    await verifyAndConsumeOTP(dto.email, dto.otp, 'RESET_PASSWORD');
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await AuthModel.updatePassword(dto.email, newPasswordHash);
    return { message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' };
  },

  // Bước 1: Phụ huynh nhập SĐT -> Kiểm tra SĐT nhà trường cấp -> Tạo & gửi OTP qua SMS Server
  async requestParentLoginOtp(phoneNumber: string) {
    const cleanPhone = phoneNumber.trim();

    // Kiểm tra số điện thoại có thuộc tài khoản phụ huynh đang hoạt động không
    const parent = await AuthModel.findActiveParentByPhone(cleanPhone);
    if (!parent) {
      throw new Error('PARENT_NOT_REGISTERED_BY_SCHOOL');
    }

    // Tạo mã OTP 6 số ngẫu nhiên (hết hạn sau 5 phút)
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Vô hiệu hóa các OTP cũ & lưu OTP mới vào DB
    await AuthModel.invalidateOldOtps(cleanPhone, 'PARENT_LOGIN');
    await AuthModel.createOtp(cleanPhone, otpCode, 'PARENT_LOGIN', expiresAt);

    // Gọi sang SMS Server (lấy url & token từ bảng settings)
    await sendSmsOtp(cleanPhone, otpCode);

    return {
      phoneNumber: cleanPhone,
      fullName: parent.full_name,
      expiresInSeconds: 300,
    };
  },

  // Bước 2: Phụ huynh nhập mã OTP -> Xác thực & cấp JWT Token
  async verifyParentLoginOtp(phoneNumber: string, otpCode: string): Promise<AuthResponseDTO> {
    const cleanPhone = phoneNumber.trim();
    const cleanOtp = otpCode.trim();

    const parent = await AuthModel.findActiveParentByPhone(cleanPhone);
    if (!parent) {
      throw new Error('PARENT_NOT_REGISTERED_BY_SCHOOL');
    }

    const validOtp = await AuthModel.findLatestActiveOtp(cleanPhone, 'PARENT_LOGIN');
    if (!validOtp) {
      throw new Error('INVALID_OR_EXPIRED_OTP');
    }

    await AuthModel.markOtpAsUsed(validOtp.id);

    const secret = process.env.JWT_SECRET || 'erm6_jwt_secret';
    const token = jwt.sign(
      {
        userId: parent.id,
        roleId: parent.role_id,
        role: 'parent',
        phoneNumber: parent.phone_number,
      },
      secret,
      { expiresIn: '7d' }
    );

    return {
      user: toUserResponseDTO(parent),
      token,
    };
  },
};
