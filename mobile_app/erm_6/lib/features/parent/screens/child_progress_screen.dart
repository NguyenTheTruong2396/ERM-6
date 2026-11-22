import 'package:flutter/material.dart';
import 'roadmap_detail_screen.dart';

class _RoadmapNode {
  final String badge;
  final String title;
  final String status;
  final bool isReview;
  final bool isFinalSummary;

  const _RoadmapNode({
    required this.badge,
    required this.title,
    this.status = 'Chưa học',
    this.isReview = false,
    this.isFinalSummary = false,
  });
}

class ChildProgressScreen extends StatelessWidget {
  const ChildProgressScreen({super.key});

  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  @override
  Widget build(BuildContext context) {
    const roadmapNodes = [
      // Chặng 1: Unit 1 - 3 + Review 1
      _RoadmapNode(badge: '1', title: 'Unit 1: My New School'),
      _RoadmapNode(badge: '2', title: 'Unit 2: My House'),
      _RoadmapNode(badge: '3', title: 'Unit 3: My Friends'),
      _RoadmapNode(
        badge: 'R1',
        title: 'Review 1 • Lộ trình bổ trợ Unit 1 - 3',
        status: 'Xem lộ trình',
        isReview: true,
      ),

      // Chặng 2: Unit 4 - 6 + Review 2
      _RoadmapNode(badge: '4', title: 'Unit 4: My Neighbourhood'),
      _RoadmapNode(badge: '5', title: 'Unit 5: Natural Wonders of Viet Nam'),
      _RoadmapNode(badge: '6', title: 'Unit 6: Our Tet Holiday'),
      _RoadmapNode(
        badge: 'R2',
        title: 'Review 2 • Lộ trình bổ trợ Unit 4 - 6',
        status: 'Xem lộ trình',
        isReview: true,
      ),

      // Chặng 3: Unit 7 - 9 + Review 3
      _RoadmapNode(badge: '7', title: 'Unit 7: Television'),
      _RoadmapNode(badge: '8', title: 'Unit 8: Sports and Games'),
      _RoadmapNode(badge: '9', title: 'Unit 9: Cities of the World'),
      _RoadmapNode(
        badge: 'R3',
        title: 'Review 3 • Lộ trình bổ trợ Unit 7 - 9',
        status: 'Xem lộ trình',
        isReview: true,
      ),

      // Chặng 4: Unit 10 - 12 + Review 4
      _RoadmapNode(badge: '10', title: 'Unit 10: Our Houses in the Future'),
      _RoadmapNode(badge: '11', title: 'Unit 11: Our Greener World'),
      _RoadmapNode(badge: '12', title: 'Unit 12: Robots'),
      _RoadmapNode(
        badge: 'R4',
        title: 'Review 4 • Lộ trình bổ trợ Unit 10 - 12',
        status: 'Xem lộ trình',
        isReview: true,
      ),

      // Chặng tổng kết toàn bộ 12 Unit
      _RoadmapNode(
        badge: '★',
        title: 'Lộ trình tổng kết toàn chương trình (12 Unit)',
        status: 'Xem tổng kết',
        isFinalSummary: true,
      ),
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Lộ trình học tập Tiếng Anh 6',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: _textPrimary),
          ),
          const SizedBox(height: 14),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: roadmapNodes.length,
            itemBuilder: (context, index) {
              final item = roadmapNodes[index];
              final isFirst = index == 0;
              final isLast = index == roadmapNodes.length - 1;
              final isClickable = item.isReview || item.isFinalSummary;

              return IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Cột mốc Timeline: Đường nối trên + Vòng tròn nằm giữa + Đường nối dưới
                    SizedBox(
                      width: 36,
                      child: Column(
                        children: [
                          Expanded(
                            child: Container(
                              width: 2,
                              color: isFirst ? Colors.transparent : const Color(0xFFE2E8F0),
                            ),
                          ),
                          Container(
                            width: 30,
                            height: 30,
                            decoration: BoxDecoration(
                              gradient: item.isFinalSummary
                                  ? const LinearGradient(colors: [_primaryBlue, _gradientCyan])
                                  : null,
                              color: item.isFinalSummary
                                  ? null
                                  : (item.isReview ? const Color(0xFFE0F2FE) : Colors.white),
                              shape: BoxShape.circle,
                              border: item.isFinalSummary
                                  ? null
                                  : Border.all(
                                color: item.isReview ? _primaryBlue : const Color(0xFFCBD5E1),
                                width: 2,
                              ),
                            ),
                            child: Center(
                              child: Text(
                                item.badge,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w900,
                                  color: item.isFinalSummary
                                      ? Colors.white
                                      : (item.isReview ? _primaryBlue : _textSecondary),
                                ),
                              ),
                            ),
                          ),
                          Expanded(
                            child: Container(
                              width: 2,
                              color: isLast ? Colors.transparent : const Color(0xFFE2E8F0),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),

                    // Thẻ nội dung chặng (Bấm được nếu là Review hoặc Tổng kết)
                    Expanded(
                      child: GestureDetector(
                        onTap: isClickable
                            ? () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => RoadmapDetailScreen(
                                title: item.title,
                                badge: item.badge,
                                isFinalSummary: item.isFinalSummary,
                              ),
                            ),
                          );
                        }
                            : null,
                        child: Container(
                          margin: const EdgeInsets.symmetric(vertical: 6),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                          decoration: BoxDecoration(
                            gradient: item.isFinalSummary
                                ? const LinearGradient(
                              colors: [_primaryBlue, _gradientCyan],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            )
                                : null,
                            color: item.isFinalSummary
                                ? null
                                : (item.isReview ? const Color(0xFFF0F7FF) : Colors.white),
                            borderRadius: BorderRadius.circular(16),
                            border: item.isFinalSummary
                                ? null
                                : Border.all(
                              color: item.isReview
                                  ? _primaryBlue.withValues(alpha: 0.35)
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  item.title,
                                  style: TextStyle(
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w800,
                                    color: item.isFinalSummary
                                        ? Colors.white
                                        : (item.isReview ? _primaryBlue : _textPrimary),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  color: item.isFinalSummary
                                      ? Colors.white.withValues(alpha: 0.2)
                                      : (item.isReview
                                      ? _primaryBlue.withValues(alpha: 0.1)
                                      : const Color(0xFFF1F5F9)),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      item.status,
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w700,
                                        color: item.isFinalSummary
                                            ? Colors.white
                                            : (item.isReview ? _primaryBlue : _textSecondary),
                                      ),
                                    ),
                                    if (isClickable) ...[
                                      const SizedBox(width: 4),
                                      Icon(
                                        Icons.arrow_forward_ios_rounded,
                                        size: 10,
                                        color: item.isFinalSummary ? Colors.white : _primaryBlue,
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}