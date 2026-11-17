import { IUser } from "./auth.model";

//Request DTOs

// Đăng ký tài khoản bằng Email
export interface RegisterDTO {
  email: string;
  fullName?: string;
  fullname?: string;
  password?: string;
  passwordhash?: string;
  roleId?: number;
  roleid?: number;
}
// Alias hỗ trợ tương thích ngược
export type registerDTO = RegisterDTO;

// Xác thực tài khoản đăng ký bằng OTP
export interface VerifyRegisterDTO {
  email: string;
  otp: string;
}
// Alias hỗ trợ tương thích ngược
export type veryfyregisterDTO = VerifyRegisterDTO;

// Đăng nhập bằng Email & Mật khẩu
export interface LoginEmailDTO {
  email: string;
  password?: string;
  passwordhash?: string;
}
// Alias hỗ trợ tương thích ngược
export type loginemailDTO = LoginEmailDTO;

// Yêu cầu quên mật khẩu
export interface ForgotPasswordDTO {
  email: string;
}
// Alias hỗ trợ tương thích ngược
export type forgotpasswordDTO = ForgotPasswordDTO;

// Đặt lại mật khẩu mới
export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword?: string;
  newpassword?: string;
}
// Alias hỗ trợ tương thích ngược
export type resetpasswordDTO = ResetPasswordDTO;

// Response DTOs 

export interface UserResponseDTO {
  id: number;
  email: string | null;
  phoneNumber: string | null;
  parentPhone: string | null;
  fullName: string;
  roleId: number;
  classroomId: number | null;
  avatarUrl: string | null;
  dob: Date | null;
  gender: boolean;
  isActive: boolean;
}

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: string;
}

// Mapper chuyển đổi User từ Database sang DTO trả về cho Client
export const toUserResponseDTO = (user: IUser): UserResponseDTO => ({
  id: user.id,
  email: user.email,
  phoneNumber: user.phone_number,
  parentPhone: user.parent_phone,
  fullName: user.full_name,
  roleId: user.role_id,
  classroomId: user.classroom_id,
  avatarUrl: user.avatar_url,
  dob: user.dob,
  gender: user.gender,
  isActive: user.is_active,
});
