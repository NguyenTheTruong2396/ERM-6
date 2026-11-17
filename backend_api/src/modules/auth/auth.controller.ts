import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  RegisterDTO,
  VerifyRegisterDTO,
  LoginEmailDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
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
          message: 'Vui lòng nhập đầy đủ email, mật khẩu (password) và họ tên (fullName)!',
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
          message: 'Vui lòng nhập email và mã OTP!',
        });
      }

      const dto: VerifyRegisterDTO = { email, otp: String(otp) };
      const data = await AuthService.verifyRegisterOTP(dto);
      return res.status(200).json({
        success: true,
        message: 'Kích hoạt tài khoản thành công!',
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
          message: 'Vui lòng nhập email và mật khẩu (password)!',
        });
      }

      const dto: LoginEmailDTO = { email, password };
      const data = await AuthService.loginWithEmail(dto);
      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công!',
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
          message: 'Vui lòng nhập email!',
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
          message: 'Vui lòng nhập đủ email, mã OTP và mật khẩu mới (newPassword)!',
        });
      }

      const dto: ResetPasswordDTO = { email, otp: String(otp), newPassword };
      const result = await AuthService.resetPassword(dto);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
};
