import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

// 1. Luồng đăng ký & kích hoạt bằng Email
router.post('/register', AuthController.register);
router.post('/verify-register', AuthController.verifyRegister);

// 2. Luồng đăng nhập bằng Email & Mật khẩu
router.post('/login', AuthController.login);

// 3. Luồng quên mật khẩu & đặt lại mật khẩu qua Email
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// 4. Luồng đăng nhập Phụ huynh bằng Số điện thoại (OTP SMS)
router.post('/parent/send-otp', AuthController.sendParentOtp);
router.post('/parent/verify-otp', AuthController.verifyParentOtp);

// Hỗ trợ thêm alias gọi trực tiếp /send-otp và /verify-otp
router.post('/send-otp', AuthController.sendParentOtp);
router.post('/verify-otp', AuthController.verifyParentOtp);

export default router;
