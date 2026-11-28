import 'package:flutter/material.dart';
import '../../../core/models/user_role.dart';
import 'login_screen.dart';
import 'register_screen.dart';

class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textSecondary = Color(0xFF64748B);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final isLandscape = constraints.maxWidth > constraints.maxHeight;

            // GIAO DIỆN KHI XOAY NGANG: Chia 2 cột trái - phải (Logo cố định bên trái, Nút bên phải)
            if (isLandscape) {
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                child: Row(
                  children: [
                    // Cột trái: Logo & Tên ứng dụng
                    Expanded(
                      flex: 4,
                      child: Center(
                        child: _buildBrandHeader(isLandscape: true),
                      ),
                    ),
                    const SizedBox(width: 28),
                    // Cột phải: Cụm nút chọn vai trò
                    Expanded(
                      flex: 6,
                      child: Center(
                        child: SingleChildScrollView(
                          child: _buildRoleButtons(context, isCompact: true),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }

            // GIAO DIỆN KHI CẦM DỌC: Logo ở nửa trên, Nút ở nửa dưới
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Column(
                children: [
                  Expanded(
                    child: Center(
                      child: _buildBrandHeader(isLandscape: false),
                    ),
                  ),
                  _buildRoleButtons(context, isCompact: false),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  /// Cụm Logo + Tên thương hiệu
  Widget _buildBrandHeader({required bool isLandscape}) {
    final logoSize = isLandscape ? 92.0 : 112.0;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: logoSize,
          height: logoSize,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: _primaryBlue.withValues(alpha: 0.22),
                blurRadius: 24,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: Image.asset(
              'assets/images/logo.png',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [_primaryBlue, _gradientCyan],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Icon(
                  Icons.auto_stories_rounded,
                  color: Colors.white,
                  size: isLandscape ? 44 : 52,
                ),
              ),
            ),
          ),
        ),
        SizedBox(height: isLandscape ? 16 : 22),
        Text(
          'English Road Map 6',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: isLandscape ? 23 : 27,
            fontWeight: FontWeight.w900,
            color: _primaryBlue,
            letterSpacing: -0.6,
          ),
        ),
      ],
    );
  }

  /// Cụm 3 nút chọn vai trò & Đăng ký
  Widget _buildRoleButtons(BuildContext context, {required bool isCompact}) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Nhóm 1: TẠI TRƯỜNG HỌC
        const Padding(
          padding: EdgeInsets.only(left: 4, bottom: 6),
          child: Text(
            'TẠI TRƯỜNG HỌC',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: _textSecondary,
              letterSpacing: 1.0,
            ),
          ),
        ),
        _InteractiveRoleButton(
          label: 'HỌC SINH',
          icon: Icons.school_rounded,
          isGradient: false,
          isCompact: isCompact,
          primaryColor: _primaryBlue,
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const LoginScreen(
                  initialRole: UserRole.studentSchool,
                ),
              ),
            );
          },
        ),
        SizedBox(height: isCompact ? 8 : 10),
        _InteractiveRoleButton(
          label: 'PHỤ HUYNH',
          icon: Icons.family_restroom_rounded,
          isGradient: false,
          isCompact: isCompact,
          primaryColor: _primaryBlue,
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const LoginScreen(
                  initialRole: UserRole.parent,
                ),
              ),
            );
          },
        ),
        SizedBox(height: isCompact ? 14 : 20),

        // Nhóm 2: CÁ NHÂN
        const Padding(
          padding: EdgeInsets.only(left: 4, bottom: 6),
          child: Text(
            'CÁ NHÂN',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: _textSecondary,
              letterSpacing: 1.0,
            ),
          ),
        ),
        _InteractiveRoleButton(
          label: 'TÀI KHOẢN CÁ NHÂN',
          icon: Icons.person_rounded,
          isGradient: true,
          isCompact: isCompact,
          primaryColor: _primaryBlue,
          gradientEndColor: _gradientCyan,
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const LoginScreen(
                  initialRole: UserRole.studentPersonal,
                ),
              ),
            );
          },
        ),
        SizedBox(height: isCompact ? 12 : 18),

        // Dòng chuyển nhanh sang Đăng ký
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Chưa có tài khoản? ',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: _textSecondary,
              ),
            ),
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const RegisterScreen(),
                  ),
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
        const SizedBox(height: 4),
      ],
    );
  }
}

/// Widget nút chọn vai trò có hiệu ứng nhún + gợn sóng khi chạm
class _InteractiveRoleButton extends StatefulWidget {
  final String label;
  final IconData icon;
  final bool isGradient;
  final bool isCompact;
  final Color primaryColor;
  final Color gradientEndColor;
  final VoidCallback onPressed;

  const _InteractiveRoleButton({
    required this.label,
    required this.icon,
    required this.isGradient,
    this.isCompact = false,
    required this.primaryColor,
    this.gradientEndColor = const Color(0xFF02A9D8),
    required this.onPressed,
  });

  @override
  State<_InteractiveRoleButton> createState() => _InteractiveRoleButtonState();
}

class _InteractiveRoleButtonState extends State<_InteractiveRoleButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedScale(
        scale: _isPressed ? 0.965 : 1.0,
        duration: const Duration(milliseconds: 110),
        curve: Curves.easeOutCubic,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          decoration: BoxDecoration(
            gradient: widget.isGradient
                ? LinearGradient(
              colors: [widget.primaryColor, widget.gradientEndColor],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            )
                : null,
            color: widget.isGradient
                ? null
                : (_isPressed ? const Color(0xFFF0F6FF) : Colors.white),
            borderRadius: BorderRadius.circular(18),
            border: widget.isGradient
                ? null
                : Border.all(
              color: _isPressed
                  ? widget.primaryColor
                  : const Color(0xFFE2E8F0),
              width: 1.5,
            ),
            boxShadow: widget.isGradient
                ? [
              BoxShadow(
                color: widget.primaryColor
                    .withValues(alpha: _isPressed ? 0.15 : 0.26),
                blurRadius: _isPressed ? 6 : 12,
                offset: Offset(0, _isPressed ? 2 : 5),
              ),
            ]
                : null,
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: widget.onPressed,
              borderRadius: BorderRadius.circular(18),
              splashColor: widget.isGradient
                  ? Colors.white.withValues(alpha: 0.25)
                  : widget.primaryColor.withValues(alpha: 0.12),
              highlightColor: Colors.transparent,
              child: Padding(
                padding: EdgeInsets.symmetric(
                  horizontal: 18,
                  vertical: widget.isCompact ? 10 : 13,
                ),
                child: Row(
                  children: [
                    Container(
                      width: widget.isCompact ? 34 : 38,
                      height: widget.isCompact ? 34 : 38,
                      decoration: BoxDecoration(
                        color: widget.isGradient
                            ? Colors.white.withValues(alpha: 0.2)
                            : widget.primaryColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        widget.icon,
                        color: widget.isGradient
                            ? Colors.white
                            : widget.primaryColor,
                        size: widget.isCompact ? 18 : 20,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        widget.label,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: widget.isGradient
                              ? Colors.white
                              : widget.primaryColor,
                          letterSpacing: 0.4,
                        ),
                      ),
                    ),
                    Icon(
                      Icons.arrow_forward_ios_rounded,
                      color: widget.isGradient
                          ? Colors.white
                          : widget.primaryColor.withValues(alpha: 0.6),
                      size: 15,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}