import 'package:flutter/material.dart';

class UnitCardWidget extends StatelessWidget {
  final int unitNumber;
  final String title;
  final String subtitle;
  final double progress;
  final VoidCallback onTap;
  final Color accentColor;
  final Color gradientEndColor;

  const UnitCardWidget({
    super.key,
    required this.unitNumber,
    required this.title,
    required this.subtitle,
    required this.progress,
    required this.onTap,
    this.accentColor = const Color(0xFF1D54E8),
    this.gradientEndColor = const Color(0xFF02A9D8),
  });

  // Xanh lá chuyển sắc đậm đà, có chiều sâu tương tự khối xanh dương
  static const Color _completedGreenStart = Color(0xFF047857);
  static const Color _completedGreenEnd = Color(0xFF10B981);
  static const Color _completedBg = Color(0xFFF0FDF8);
  static const Color _completedBorder = Color(0xFF6EE7B7);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  @override
  Widget build(BuildContext context) {
    final bool isCompleted = progress >= 1.0;
    final int percent = (progress * 100).round();

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: isCompleted ? _completedBg : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isCompleted ? _completedBorder : const Color(0xFFE2E8F0),
          width: isCompleted ? 1.3 : 1.0,
        ),
        boxShadow: [
          BoxShadow(
            color: (isCompleted ? _completedGreenStart : accentColor).withValues(alpha: 0.06),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              // Ô số thứ tự Unit đổ gradient đồng bộ (Xanh lá đậm / Xanh dương / Tím Tập 2)
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isCompleted
                        ? const [_completedGreenStart, _completedGreenEnd]
                        : [accentColor, gradientEndColor],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Center(
                  child: Text(
                    '$unitNumber',
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),

              // Tên Unit, số trang & thanh tiến độ
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: _textPrimary,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 12.5,
                        color: _textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(6),
                            child: LinearProgressIndicator(
                              value: progress.clamp(0.0, 1.0),
                              minHeight: 5.5,
                              backgroundColor: isCompleted
                                  ? _completedGreenStart.withValues(alpha: 0.16)
                                  : accentColor.withValues(alpha: 0.12),
                              valueColor: AlwaysStoppedAnimation<Color>(
                                isCompleted ? _completedGreenStart : accentColor,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          '$percent%',
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w800,
                            color: isCompleted ? _completedGreenStart : accentColor,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.chevron_right_rounded,
                color: isCompleted ? _completedGreenStart : _textSecondary,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }
}