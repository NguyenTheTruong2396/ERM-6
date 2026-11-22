import 'dart:async';
import 'package:flutter/material.dart';
import '../../../core/models/user_role.dart';
import 'forgot_password_screen.dart';
import 'register_screen.dart';
import '../../parent/screens/parent_main_screen.dart';
import '../../student/screens/student_main_screen.dart';

class LoginScreen extends StatefulWidget {
  final UserRole initialRole;

  const LoginScreen({super.key, required this.initialRole});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  final _formKey = GlobalKey<FormState>();

  // Controller cho Học sinh & Cá nhân (Gmail + Mật khẩu)
  final _gmailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  // Controller & State cho Phụ huynh (SĐT + OTP)
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  bool _otpSent = false;
  int _resendSeconds = 0;
  Timer? _timer;

  @override
  void dispose() {
    _gmailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    _otpController.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startResendCountdown() {
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
    final phone = _phoneController.text.trim();
    if (phone.length < 9) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập số điện thoại hợp lệ')),
      );
      return;
    }
    setState(() => _otpSent = true);
    _startResendCountdown();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Đã gửi mã OTP đến số $phone')),
    );
  }

  void _handleLogin() {
    if (widget.initialRole == UserRole.parent) {
      if (!_otpSent) {
        _handleSendOtp();
        return;
      }
      if (_otpController.text.trim().length < 4) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Vui lòng nhập đầy đủ mã OTP')),
        );
        return;
      }
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const ParentMainScreen()),
            (route) => false,
      );
      return;
    }


    //if (!_formKey.currentState!.validate()) return;

    final isSchool = widget.initialRole == UserRole.studentSchool;
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (_) => StudentMainScreen(
          studentName: 'Nguyễn Văn A',
          isSchoolStudent: isSchool,
        ),
      ),
          (route) => false,
    );
  }

  IconData get _roleIcon {
    switch (widget.initialRole) {
      case UserRole.studentSchool:
        return Icons.school_rounded;
      case UserRole.parent:
        return Icons.family_restroom_rounded;
      case UserRole.studentPersonal:
        return Icons.person_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isParent = widget.initialRole == UserRole.parent;
    final isPersonal = widget.initialRole == UserRole.studentPersonal;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: _textPrimary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Logo ERM-6 + Nhãn vai trò
                Center(
                  child: Column(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: Image.asset(
                          'assets/images/logo.png',
                          width: 68,
                          height: 68,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            width: 68,
                            height: 68,
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [_primaryBlue, _gradientCyan],
                              ),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Icon(Icons.auto_stories_rounded, color: Colors.white, size: 34),
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: _primaryBlue.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(_roleIcon, size: 15, color: _primaryBlue),
                            const SizedBox(width: 6),
                            Text(
                              widget.initialRole.displayName,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                                color: _primaryBlue,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Đăng nhập',
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          color: _textPrimary,
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 28),

                // RENDER FORM THEO TỪNG VAI TRÒ
                if (isParent)
                  _buildParentOtpForm()
                else
                  _buildGmailPasswordForm(),

                const SizedBox(height: 22),

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
                    onPressed: _handleLogin,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Text(
                      isParent
                          ? (_otpSent ? 'XÁC NHẬN ĐĂNG NHẬP' : 'NHẬN MÃ OTP')
                          : 'ĐĂNG NHẬP',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ),

                // Chỉ Cá nhân mới có Đăng nhập Google 4 màu & Đăng ký ngay
                if (isPersonal) ...[
                  const SizedBox(height: 22),
                  Row(
                    children: [
                      const Expanded(child: Divider(color: Color(0xFFE2E8F0))),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Text(
                          'HOẶC',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: Colors.grey.shade400,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ),
                      const Expanded(child: Divider(color: Color(0xFFE2E8F0))),
                    ],
                  ),
                  const SizedBox(height: 20),

                  OutlinedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Đang mở đăng nhập Google...')),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: _textPrimary,
                      side: const BorderSide(color: Color(0xFFE2E8F0), width: 1.5),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _GoogleLogo(size: 20),
                        SizedBox(width: 10),
                        Text(
                          'ĐĂNG NHẬP BẰNG GOOGLE',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: _textPrimary,
                            letterSpacing: 0.3,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Bạn chưa có tài khoản? ',
                        style: TextStyle(fontSize: 13, color: _textSecondary),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(builder: (_) => const RegisterScreen()),
                          );
                        },
                        child: const Text(
                          'Đăng ký ngay',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: _primaryBlue,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Form 1: Dùng chung cho Học sinh & Cá nhân (Nhập Gmail + Mật khẩu + Quên mật khẩu)
  Widget _buildGmailPasswordForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'Gmail',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: _textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: _gmailController,
          keyboardType: TextInputType.emailAddress,
          decoration: _inputDecoration(
            hint: 'Nhập địa chỉ Gmail...',
            icon: Icons.email_outlined,
          ),
          validator: (val) {
            if (val == null || val.trim().isEmpty) {
              return 'Vui lòng nhập Gmail';
            }
            if (!val.contains('@')) {
              return 'Địa chỉ Gmail không hợp lệ';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),

        const Text(
          'Mật khẩu',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: _textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: _passwordController,
          obscureText: _obscurePassword,
          decoration: _inputDecoration(
            hint: 'Nhập mật khẩu...',
            icon: Icons.lock_outline_rounded,
            suffixIcon: IconButton(
              icon: Icon(
                _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                color: const Color(0xFF94A3B8),
                size: 20,
              ),
              onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
            ),
          ),
          validator: (val) =>
          (val == null || val.length < 6) ? 'Mật khẩu tối thiểu 6 ký tự' : null,
        ),

        // Chuyển sang trang Quên mật khẩu riêng
        Align(
          alignment: Alignment.centerRight,
          child: TextButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ForgotPasswordScreen()),
              );
            },
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
            ),
            child: const Text(
              'Quên mật khẩu?',
              style: TextStyle(
                fontSize: 12.5,
                fontWeight: FontWeight.w800,
                color: _primaryBlue,
              ),
            ),
          ),
        ),
      ],
    );
  }

  /// Form 2: Dành riêng cho Phụ huynh (Nhập SĐT -> Nhận & nhập mã OTP)
  Widget _buildParentOtpForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'Số điện thoại',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: _textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: _phoneController,
          keyboardType: TextInputType.phone,
          enabled: !_otpSent,
          decoration: _inputDecoration(
            hint: 'Nhập số điện thoại...',
            icon: Icons.phone_android_rounded,
            suffixIcon: _otpSent
                ? TextButton(
              onPressed: () {
                _timer?.cancel();
                setState(() {
                  _otpSent = false;
                  _otpController.clear();
                });
              },
              child: const Text(
                'Đổi SĐT',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: _primaryBlue,
                ),
              ),
            )
                : null,
          ),
        ),

        if (_otpSent) ...[
          const SizedBox(height: 18),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Mã xác thực OTP (6 số)',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: _textPrimary,
                ),
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
        ],
      ],
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

/// Widget vẽ Logo chữ G 4 màu chuẩn của Google
class _GoogleLogo extends StatelessWidget {
  final double size;
  const _GoogleLogo({this.size = 20});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, size),
      painter: _GoogleLogoPainter(),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;
    final double strokeWidth = w * 0.2;
    final Rect rect = Rect.fromLTWH(
      strokeWidth / 2,
      strokeWidth / 2,
      w - strokeWidth,
      h - strokeWidth,
    );

    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.butt;

    // 1. Đỏ (trên cùng)
    paint.color = const Color(0xFFEA4335);
    canvas.drawArc(rect, -2.4, 1.75, false, paint);

    // 2. Vàng (bên trái)
    paint.color = const Color(0xFFFBBC05);
    canvas.drawArc(rect, 2.35, 1.55, false, paint);

    // 3. Xanh lá (dưới cùng)
    paint.color = const Color(0xFF34A853);
    canvas.drawArc(rect, 0.78, 1.6, false, paint);

    // 4. Xanh dương (bên phải + thanh ngang chữ G)
    paint.color = const Color(0xFF4285F4);
    canvas.drawArc(rect, -0.05, 0.88, false, paint);

    final Paint barPaint = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.fill;
    canvas.drawRect(
      Rect.fromLTWH(w * 0.5, h * 0.41, w * 0.48, strokeWidth),
      barPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}