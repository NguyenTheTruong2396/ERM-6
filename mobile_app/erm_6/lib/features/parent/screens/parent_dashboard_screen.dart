import 'package:flutter/material.dart';
import '../widgets/child_selector_sheet.dart';

class ParentDashboardScreen extends StatelessWidget {
  final ChildInfo activeChild;
  final int totalChildren;
  final VoidCallback onSwitchChild;

  const ParentDashboardScreen({
    super.key,
    required this.activeChild,
    required this.totalChildren,
    required this.onSwitchChild,
  });

  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  @override
  Widget build(BuildContext context) {
    final List scoreHistory = [];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 1. Thẻ xanh Học sinh liên kết (Bấm vào để đổi con khác)
          GestureDetector(
            onTap: onSwitchChild,
            child: Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [_primaryBlue, _gradientCyan],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(22),
                boxShadow: [
                  BoxShadow(
                    color: _primaryBlue.withValues(alpha: 0.22),
                    blurRadius: 14,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.school_rounded, color: Colors.white, size: 26),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          activeChild.name,
                          style: const TextStyle(fontSize: 16.5, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          '${activeChild.className}',
                          style: const TextStyle(fontSize: 12, color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                  if (totalChildren > 1)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.swap_horiz_rounded, color: Colors.white, size: 16),
                          SizedBox(width: 4),
                          Text(
                            'Đổi con',
                            style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),

          // 2. Dashboard theo dõi tiến độ SGK & Điểm trung bình
          const Row(
            children: [
              Expanded(
                child: _MetricCard(
                  title: 'Tiến độ SGK',
                  value: '0 / 12',
                  subtitle: 'Unit đã hoàn thành',
                  icon: Icons.menu_book_rounded,
                  color: _primaryBlue,
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: _MetricCard(
                  title: 'Điểm trung bình',
                  value: '--',
                  subtitle: 'Chưa có bài kiểm tra',
                  icon: Icons.insights_rounded,
                  color: Color(0xFF0284C7),
                ),
              ),
            ],
          ),
          const SizedBox(height: 22),

          // 3. Biểu đồ theo dõi tiến trình điểm số theo thời gian
          const Text(
            'Biểu đồ tiến trình điểm số',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: _textPrimary),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: scoreHistory.isEmpty
                ? const Padding(
                    padding: EdgeInsets.symmetric(vertical: 26),
                    child: Column(
                      children: [
                        Icon(Icons.show_chart_rounded, size: 36, color: Color(0xFF94A3B8)),
                        SizedBox(height: 8),
                        Text(
                          'Chưa có dữ liệu điểm theo thời gian',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: _textPrimary),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Biểu đồ sẽ tự động hiển thị sau khi con hoàn thành bài kiểm tra đầu tiên.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12, color: _textSecondary),
                        ),
                      ],
                    ),
                  )
                : const SizedBox.shrink(),
          ),
          const SizedBox(height: 22),

          // 4. Báo cáo phân tích
          const Text(
            'Báo cáo phân tích năng lực',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: _textPrimary),
          ),
          const SizedBox(height: 10),
          const _AnalysisCard(
            title: 'Điểm mạnh của con',
            description: 'Chưa đủ dữ liệu bài làm để tổng hợp điểm mạnh.',
            icon: Icons.thumb_up_alt_outlined,
            accentColor: Color(0xFF059669),
            bgColor: Color(0xFFECFDF5),
          ),
          const SizedBox(height: 10),
          const _AnalysisCard(
            title: 'Điểm yếu cần cải thiện',
            description: 'Hệ thống sẽ tự động phân tích phần kiến thức con hay sai sau khi nộp bài.',
            icon: Icons.lightbulb_outline_rounded,
            accentColor: Color(0xFFD97706),
            bgColor: Color(0xFFFFFBEB),
          ),
        ],
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;
  final Color color;

  const _MetricCard({
    required this.title,
    required this.value,
    required this.subtitle,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
          const SizedBox(height: 2),
          Text(subtitle, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
        ],
      ),
    );
  }
}

class _AnalysisCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final Color accentColor;
  final Color bgColor;

  const _AnalysisCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.accentColor,
    required this.bgColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(12)),
            child: Icon(icon, color: accentColor, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: accentColor)),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(fontSize: 12.5, color: Color(0xFF475569), height: 1.4),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}