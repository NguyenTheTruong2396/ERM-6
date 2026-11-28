import 'dart:async';
import 'package:flutter/material.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  final _emailController = TextEditingController();
  final _otpController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  // Bước 1: Nhập Gmail | Bước 2: Nhập OTP | Bước 3: Nhập mật khẩu mới
  int _currentStep = 1;
  bool _obscureNewPass = true;
  bool _obscureConfirmPass = true;
  int _resendSeconds = 0;
  Timer? _timer;

  @override
  void dispose() {
    _emailController.dispose();
    _otpController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startCountdown() {
    _timer?.cancel();
    setState(() => _resendSeconds = 60);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendSeconds <= 1) {
        timer.cancel();
        setState(() => _resendSeconds = 0);
      } else {
        setState(() => _resendSeconds--);
      }
    });
  }

  void _handleSendOtp() {
    final email = _emailController.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập địa chỉ Gmail hợp lệ')),
      );
      return;
    }
    setState(() => _currentStep = 2);
    _startCountdown();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Đã gửi mã OTP đến $email')),
    );
  }

  void _handleVerifyOtp() {
    if (_otpController.text.trim().length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập đầy đủ mã OTP')),
      );
      return;
    }
    setState(() => _currentStep = 3);
  }

  void _handleResetPassword() {
    final newPass = _newPasswordController.text;
    final confirmPass = _confirmPasswordController.text;

    if (newPass.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Mật khẩu mới phải có ít nhất 6 ký tự')),
      );
      return;
    }
    if (newPass != confirmPass) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Mật khẩu xác nhận không khớp')),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.'),
        backgroundColor: Color(0xFF059669),
      ),
    );

    // Quay về lại trang Đăng nhập
    Navigator.pop(context);
  }

  String get _stepTitle {
    switch (_currentStep) {
      case 1:
        return 'Quên mật khẩu';
      case 2:
        return 'Nhập mã xác thực OTP';
      default:
        return 'Đặt mật khẩu mới';
    }
  }

  String get _stepSubtitle {
    switch (_currentStep) {
      case 1:
        return 'Nhập địa chỉ Gmail đã liên kết với tài khoản để nhận mã xác thực OTP.';
      case 2:
        return 'Mã OTP 6 số đã được gửi đến\n${_emailController.text.trim()}';
      default:
        return 'Tạo mật khẩu mới cho tài khoản của bạn.';
    }
  }

  String get _buttonLabel {
    switch (_currentStep) {
      case 1:
        return 'GỬI MÃ OTP';
      case 2:
        return 'XÁC NHẬN MÃ OTP';
      default:
        return 'ĐỔI MẬT KHẨU';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: _textPrimary, size: 20),
          onPressed: () {
            if (_currentStep > 1) {
              setState(() => _currentStep--);
            } else {
              Navigator.pop(context);
            }
          },
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Thanh chỉ báo 3 bước nhỏ gọn
              Row(
                children: [
                  _buildStepDot(1),
                  const SizedBox(width: 8),
                  _buildStepDot(2),
                  const SizedBox(width: 8),
                  _buildStepDot(3),
                ],
              ),
              const SizedBox(height: 24),

              Text(
                _stepTitle,
                style: const TextStyle(
                  fontSize: 25,
                  fontWeight: FontWeight.w900,
                  color: _textPrimary,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _stepSubtitle,
                style: const TextStyle(
                  fontSize: 13.5,
                  color: _textSecondary,
                  height: 1.45,
                ),
              ),
              const SizedBox(height: 28),

              // Nội dung từng bước
              if (_currentStep == 1) ...[
                const Text(
                  'Gmail',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: _textPrimary),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: _inputDecoration(
                    hint: 'Nhập địa chỉ Gmail của bạn...',
                    icon: Icons.email_outlined,
                  ),
                ),
              ] else if (_currentStep == 2) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Mã OTP (6 số)',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: _textPrimary),
                    ),
                    GestureDetector(
                      onTap: _resendSeconds == 0 ? _handleSendOtp : null,
                      child: Text(
                        _resendSeconds > 0 ? 'Gửi lại sau ${_resendSeconds}s' : 'Gửi lại mã',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: _resendSeconds > 0 ? _textSecondary : _primaryBlue,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _otpController,
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 8,
                    color: _textPrimary,
                  ),
                  decoration: _inputDecoration(
                    hint: '••••••',
                    icon: Icons.verified_user_outlined,
                  ).copyWith(counterText: ''),
                ),
              ] else ...[
                const Text(
                  'Mật khẩu mới',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: _textPrimary),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _newPasswordController,
                  obscureText: _obscureNewPass,
                  decoration: _inputDecoration(
                    hint: 'Nhập mật khẩu mới (tối thiểu 6 ký tự)...',
                    icon: Icons.lock_outline_rounded,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscureNewPass ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                        color: const Color(0xFF94A3B8),
                        size: 20,
                      ),
                      onPressed: () => setState(() => _obscureNewPass = !_obscureNewPass),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Xác nhận mật khẩu mới',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: _textPrimary),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _confirmPasswordController,
                  obscureText: _obscureConfirmPass,
                  decoration: _inputDecoration(
                    hint: 'Nhập lại mật khẩu mới...',
                    icon: Icons.lock_reset_rounded,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscureConfirmPass ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                        color: const Color(0xFF94A3B8),
                        size: 20,
                      ),
                      onPressed: () => setState(() => _obscureConfirmPass = !_obscureConfirmPass),
                    ),
                  ),
                ),
              ],

              const SizedBox(height: 26),

              // Nút hành động chính
              Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [_primaryBlue, _gradientCyan],
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: _primaryBlue.withValues(alpha: 0.25),
                      blurRadius: 12,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: ElevatedButton(
                  onPressed: () {
                    if (_currentStep == 1) {
                      _handleSendOtp();
                    } else if (_currentStep == 2) {
                      _handleVerifyOtp();
                    } else {
                      _handleResetPassword();
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: Text(
                    _buttonLabel,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 0.5),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepDot(int step) {
    final isActive = step <= _currentStep;
    return Expanded(
      child: Container(
        height: 4,
        decoration: BoxDecoration(
          color: isActive ? _primaryBlue : const Color(0xFFE2E8F0),
          borderRadius: BorderRadius.circular(4),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration({
    required String hint,
    required IconData icon,
    Widget? suffixIcon,
  }) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8), letterSpacing: 0),
      prefixIcon: Icon(icon, color: const Color(0xFF94A3B8), size: 20),
      suffixIcon: suffixIcon,
      filled: true,
      fillColor: const Color(0xFFF8FAFC),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: _primaryBlue, width: 1.5),
      ),
    );
  }
}