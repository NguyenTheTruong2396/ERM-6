import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

// 1. Email registration & activation flow
router.post('/register', AuthController.register);
router.post('/verify-register', AuthController.verifyRegister);

// 2. Email & Password login flow
router.post('/login', AuthController.login);

// 3. Forgot password & reset password flow via Email
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// 4. Parent phone login flow (SMS OTP)
router.post('/parent/send-otp', AuthController.sendParentOtp);
router.post('/parent/verify-otp', AuthController.verifyParentOtp);

// Backward compatibility aliases for /send-otp and /verify-otp
router.post('/send-otp', AuthController.sendParentOtp);
router.post('/verify-otp', AuthController.verifyParentOtp);
// login with google
router.post('/google', AuthController.googleLogin);

// 5. Logout
router.post('/logout', AuthController.logout);

export default router;
