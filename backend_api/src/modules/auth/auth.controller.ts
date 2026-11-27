import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  RegisterDTO,
  VerifyRegisterDTO,
  LoginEmailDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  GoogleLoginDTO
} from './auth.dto';

export const AuthController = {
  // POST /api/auth/register
  async register(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const fullName = req.body.fullName || req.body.fullname;
      const password = req.body.password || req.body.passwordhash;
      const roleId = req.body.roleId || req.body.roleid;

      if (!email || !password || !fullName) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email, password, and fullName!',
        });
      }

      const dto: RegisterDTO = { email, fullName, password, roleId };
      const result = await AuthService.register(dto);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // POST /api/auth/verify-register
  async verifyRegister(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and OTP code!',
        });
      }

      const dto: VerifyRegisterDTO = { email, otp: String(otp) };
      const data = await AuthService.verifyRegisterOTP(dto);
      return res.status(200).json({
        success: true,
        message: 'Account activated successfully!',
        data,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // POST /api/auth/login
  async login(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const password = req.body.password || req.body.passwordhash;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password!',
        });
      }

      const dto: LoginEmailDTO = { email, password };
      const data = await AuthService.loginWithEmail(dto);
      return res.status(200).json({
        success: true,
        message: 'Login successful!',
        data,
      });
    } catch (error: any) {
      return res.status(401).json({ success: false, message: error.message });
    }
  },

  // POST /api/auth/forgot-password
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email!',
        });
      }

      const dto: ForgotPasswordDTO = { email };
      const result = await AuthService.forgotPassword(dto);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // POST /api/auth/reset-password
  async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const newPassword = req.body.newPassword || req.body.newpassword;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email, OTP code, and newPassword!',
        });
      }

      const dto: ResetPasswordDTO = { email, otp: String(otp), newPassword };
      const result = await AuthService.resetPassword(dto);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  async sendParentOtp(req: Request, res: Response) {
    try {
      const phoneNumber = req.body.phoneNumber || req.body.phone;
      if (!phoneNumber || !String(phoneNumber).trim()) {
        return res.status(400).json({
          success: false,
          message: 'Please provide parent phone number (phoneNumber)!',
        });
      }

      const data = await AuthService.requestParentLoginOtp(String(phoneNumber));
      return res.status(200).json({
        success: true,
        message: 'OTP code has been sent to parent phone number!',
        data,
      });
    } catch (error: any) {
      if (error.message === 'PARENT_NOT_REGISTERED_BY_SCHOOL') {
        return res.status(404).json({
          success: false,
          message: 'This phone number is not registered for a parent account by the school or has been deactivated!',
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || 'Server error while sending OTP code!',
      });
    }
  },

  async verifyParentOtp(req: Request, res: Response) {
    try {
      const phoneNumber = req.body.phoneNumber || req.body.phone;
      const otpCode = req.body.otpCode || req.body.otp;
      if (!phoneNumber || !otpCode) {
        return res.status(400).json({
          success: false,
          message: 'Please provide phone number (phoneNumber) and OTP code (otpCode / otp)!',
        });
      }

      const data = await AuthService.verifyParentLoginOtp(String(phoneNumber), String(otpCode));
      return res.status(200).json({
        success: true,
        message: 'Parent login successful!',
        data,
      });
    } catch (error: any) {
      if (error.message === 'INVALID_OR_EXPIRED_OTP') {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP code!',
        });
      }
      if (error.message === 'PARENT_NOT_REGISTERED_BY_SCHOOL') {
        return res.status(404).json({
          success: false,
          message: 'Valid parent account not found!',
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || 'Server error while verifying OTP code!',
      });
    }
  },
  // login with google
  async googleLogin(req: Request, res: Response) {
    try {
      const { idToken } = req.body as GoogleLoginDTO;
      if (!idToken || !idToken.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Google authentication token (idToken) is required.',
        });
      }

      const data = await AuthService.loginWithGoogle(idToken);
      return res.status(200).json({
        success: true,
        message: 'Google login successful.',
        data,
      });
    } catch (error: any) {
      if (error.message === 'INVALID_GOOGLE_TOKEN' || error.message === 'GOOGLE_EMAIL_NOT_FOUND' || error.message === 'GOOGLE_ACCOUNT_NOT_FOUND') {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired Google token.',
        });
      }
      if (error.message === 'ACCOUNT_DISABLED') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been disabled.',
        });
      }
      if (error.message === 'EMAIL_NOT_REGISTERED_IN_SYSTEM') {
        return res.status(404).json({
          success: false,
          message: 'This Google email is not registered in the system.',
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error during Google login.',
      });
    }
  },

  // POST /api/auth/logout
  async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required!',
        });
      }

      // Gọi AuthService.logout(token) để lưu vào blacklist hoặc xóa refreshToken trong DB
      return res.status(200).json({
        success: true,
        message: 'Logout successful!',
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
