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
import { OAuth2Client } from 'google-auth-library';

const DEFAULT_ROLE_ID = 3; // Default role: student
// config link client secret
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
  const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await AuthModel.invalidateOldOtps(target, purpose);
  await AuthModel.createOtp(target, otpCode, purpose, expireAt);
  return otpCode;
};

const verifyAndConsumeOTP = async (target: string, inputOtp: string, purpose: string) => {
  const activeOtp = await AuthModel.findLatestActiveOtp(target, purpose);
  if (!activeOtp) {
    throw new Error('OTP code does not exist or has expired!');
  }

  if (activeOtp.otp_code !== inputOtp) {
    await AuthModel.incrementOtpAttempts(activeOtp.id);
    const remaining = 5 - (activeOtp.attempts + 1);
    throw new Error(
      remaining > 0
        ? `Incorrect OTP code! You have ${remaining} attempts remaining.`
        : 'You have entered incorrect OTP more than 5 times. Please request a new code!'
    );
  }

  await AuthModel.markOtpAsUsed(activeOtp.id);
};

export const AuthService = {
  // 1A. Register & Send Email OTP
  async register(dto: RegisterDTO) {
    const rawPassword = dto.password || dto.passwordhash;
    const fullName = dto.fullName || dto.fullname;
    const roleId = dto.roleId || dto.roleid || DEFAULT_ROLE_ID;

    if (!rawPassword) {
      throw new Error('Password cannot be empty!');
    }
    if (!fullName) {
      throw new Error('Full name cannot be empty!');
    }

    const existing = await AuthModel.findUserByEmail(dto.email);
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    if (existing) {
      if (existing.is_active) {
        throw new Error('This email has already been registered and activated!');
      }
      await AuthModel.updateUnverifiedUser(dto.email, passwordHash, fullName, roleId);
    } else {
      await AuthModel.createUserWithEmail(dto.email, passwordHash, fullName, roleId);
    }

    const otp = await createAndSaveOTP(dto.email, 'REGISTER');
    await sendEmailOTP(dto.email, otp, 'Activate ERM-6 account');
    return { message: 'An OTP code has been sent to your email. Please verify to activate your account.' };
  },

  // 1B. Verify OTP to activate account
  async verifyRegisterOTP(dto: VerifyRegisterDTO): Promise<AuthResponseDTO> {
    await verifyAndConsumeOTP(dto.email, dto.otp, 'REGISTER');
    const user = await AuthModel.activateUserByEmail(dto.email);
    if (!user) {
      throw new Error('Account activation failed. User does not exist!');
    }
    return { user: toUserResponseDTO(user), token: signToken(user) };
  },

  // 2. Login with Email & Password
  async loginWithEmail(dto: LoginEmailDTO): Promise<AuthResponseDTO> {
    const rawPassword = dto.password || dto.passwordhash;
    if (!rawPassword) {
      throw new Error('Please enter your password!');
    }

    const user = await AuthModel.findUserByEmail(dto.email);
    if (!user) throw new Error('Incorrect email or password!');
    if (!user.is_active) throw new Error('Account is not activated yet. Please verify OTP via email!');
    if (!user.password_hash) throw new Error('Account does not have a password set!');

    const isMatch = await bcrypt.compare(rawPassword, user.password_hash);
    if (!isMatch) throw new Error('Incorrect email or password!');

    return { user: toUserResponseDTO(user), token: signToken(user) };
  },

  // 3A. Forgot password: Send OTP via Email
  async forgotPassword(dto: ForgotPasswordDTO) {
    const user = await AuthModel.findUserByEmail(dto.email);
    if (!user) throw new Error('Email does not exist in the system!');

    const otp = await createAndSaveOTP(dto.email, 'RESET_PASSWORD');
    await sendEmailOTP(dto.email, otp, 'Reset ERM-6 account password');
    return { message: 'Password reset OTP code has been sent to your email.' };
  },

  // 3B. Forgot password: Verify OTP & set new password
  async resetPassword(dto: ResetPasswordDTO) {
    const newPassword = dto.newPassword || dto.newpassword;
    if (!newPassword) {
      throw new Error('Please enter your new password!');
    }

    await verifyAndConsumeOTP(dto.email, dto.otp, 'RESET_PASSWORD');
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await AuthModel.updatePassword(dto.email, newPasswordHash);
    return { message: 'Password reset successful! You can now log in with your new password.' };
  },

  // Step 1: Parent inputs phone -> Verify school pre-provisioned phone -> Generate & send OTP via SMS Server
  async requestParentLoginOtp(phoneNumber: string) {
    const cleanPhone = phoneNumber.trim();

    // Check if phone number belongs to an active parent account
    const parent = await AuthModel.findActiveParentByPhone(cleanPhone);
    if (!parent) {
      throw new Error('PARENT_NOT_REGISTERED_BY_SCHOOL');
    }

    // Generate random 6-digit OTP code (expires in 5 minutes)
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Invalidate previous OTPs & save new OTP to DB
    await AuthModel.invalidateOldOtps(cleanPhone, 'PARENT_LOGIN');
    await AuthModel.createOtp(cleanPhone, otpCode, 'PARENT_LOGIN', expiresAt);

    // Call SMS Server (retrieve url & token from settings table)
    await sendSmsOtp(cleanPhone, otpCode);

    return {
      phoneNumber: cleanPhone,
      fullName: parent.full_name,
      expiresInSeconds: 300,
    };
  },

  // Step 2: Parent inputs OTP code -> Verify & issue JWT Token
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

    if (validOtp.otp_code !== cleanOtp) {
      await AuthModel.incrementOtpAttempts(validOtp.id);
      if ((validOtp.attempts ?? 0) + 1 >= 5) {
        await AuthModel.markOtpAsUsed(validOtp.id);
      }
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
  // login with google
  async loginWithGoogle(idToken: string): Promise<AuthResponseDTO> {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID_NOT_CONFIGURED');
    }

    // 1.verify ifToken with google server
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (error) {
      throw new Error('INVALID_GOOGLE_TOKEN');
    }

    if (!payload || !payload.sub) {
      throw new Error('GOOGLE_ACCOUNT_NOT_FOUND');
    }

    const googleId = payload.sub;
    const fullName = payload.name || (payload.email ? payload.email.split('@')[0] : 'Google User');
    const avatarUrl = payload.picture || null;

    // 2. Check whether the `google_id` already exists in ERM-6.
    let user = await AuthModel.findUserByGoogleId(googleId);

    if (!user) {
      user = await AuthModel.createGoogleUser({
        googleId,
        fullName,
        avatarUrl,
        roleId: 3, // Change according to the system's default role
      });
    } else {
      if (!user.is_active) {
        throw new Error('ACCOUNT_DISABLED');
      }

      if (avatarUrl && !user.avatar_url) {
        await AuthModel.updateAvatarIfEmpty(user.id, avatarUrl);
        user.avatar_url = avatarUrl;
      }
    }

    // 3. Sign the ERM-6 system JWT token
    const secret = process.env.JWT_SECRET || 'erm6_jwt_secret';
    const token = jwt.sign(
      {
        userId: user.id,
        roleId: user.role_id,
        email: user.email,
      },
      secret,
      { expiresIn: '7d' }
    );

    return {
      user: toUserResponseDTO(user),
      token,
    };
  },
};
