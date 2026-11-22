import { IUser } from "./auth.model";

// Request DTOs

// Register account with Email
export interface RegisterDTO {
  email: string;
  fullName?: string;
  fullname?: string;
  password?: string;
  passwordhash?: string;
  roleId?: number;
  roleid?: number;
}
// Backward compatibility alias
export type registerDTO = RegisterDTO;

// Verify registration with OTP
export interface VerifyRegisterDTO {
  email: string;
  otp: string;
}
// Backward compatibility alias
export type veryfyregisterDTO = VerifyRegisterDTO;

// Login with Email & Password
export interface LoginEmailDTO {
  email: string;
  password?: string;
  passwordhash?: string;
}
// Backward compatibility alias
export type loginemailDTO = LoginEmailDTO;

// Forgot password request
export interface ForgotPasswordDTO {
  email: string;
}
// Backward compatibility alias
export type forgotpasswordDTO = ForgotPasswordDTO;

// Reset new password
export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword?: string;
  newpassword?: string;
}
// Backward compatibility alias
export type resetpasswordDTO = ResetPasswordDTO;

// Login with phone number
export interface ParentSendOtpDTO {
  phoneNumber: string;
}
// Backward compatibility alias
export type parentsenotpDTO = ParentSendOtpDTO;

// Verify OTP for login
export interface ParentVerifyOtpDTO {
  phoneNumber: string;
  otpCode: string;
}
// Backward compatibility alias
export type parentverifyotpDTO = ParentVerifyOtpDTO;

// Login with google
export interface GoogleLoginDTO{
  idToken: string;
}
// Backward compatibility alias
export type googleloginDTO = GoogleLoginDTO;

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

// Mapper to transform database User entity to Client Response DTO
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
