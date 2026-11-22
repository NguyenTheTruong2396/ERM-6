import 'package:flutter/material.dart';

enum ToastType { info, success, warning, error }

class AppToast {
  static void show(
      BuildContext context,
      String message, {
        ToastType type = ToastType.info,
      }) {
    Color bgColor;
    Color borderColor;
    Color iconColor;
    IconData iconData;

    switch (type) {
      case ToastType.success:
        bgColor = const Color(0xFFECFDF5);
        borderColor = const Color(0xFF6EE7B7);
        iconColor = const Color(0xFF047857);
        iconData = Icons.check_circle_rounded;
        break;
      case ToastType.warning:
        bgColor = const Color(0xFFFFFBEB);
        borderColor = const Color(0xFFFDE68A);
        iconColor = const Color(0xFFD97706);
        iconData = Icons.info_rounded;
        break;
      case ToastType.error:
        bgColor = const Color(0xFFFEF2F2);
        borderColor = const Color(0xFFFECACA);
        iconColor = const Color(0xFFDC2626);
        iconData = Icons.error_rounded;
        break;
      case ToastType.info:
        bgColor = const Color(0xFFEFF6FF);
        borderColor = const Color(0xFFBFDBFE);
        iconColor = const Color(0xFF1D54E8);
        iconData = Icons.notifications_active_rounded;
        break;
    }

    final messenger = ScaffoldMessenger.of(context);
    messenger.hideCurrentSnackBar();
    messenger.showSnackBar(
      SnackBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 20),
        duration: const Duration(milliseconds: 2400),
        content: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: borderColor, width: 1.3),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF0F172A).withValues(alpha: 0.08),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              Icon(iconData, color: iconColor, size: 21),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  message,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                    height: 1.35,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}