import 'package:flutter/material.dart';

class RoadmapDetailScreen extends StatelessWidget {
  final String title;
  final String badge;
  final bool isFinalSummary;

  const RoadmapDetailScreen({
    super.key,
    required this.title,
    required this.badge,
    this.isFinalSummary = false,
  });

  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  @override
  Widget build(BuildContext context) {
    final List focusTopics = isFinalSummary
        ? const [
      'Tổng hợp 12 chủ điểm từ vựng trọng tâm Tiếng Anh 6',
      'Phân biệt các thì cơ bản: Hiện tại đơn, Hiện tại tiếp diễn, Quá khứ đơn, Tương lai đơn',
      'Cấu trúc so sánh hơn, so sánh nhất và câu điều kiện loại 1',
    ]
        : const [
      'Củng cố chia động từ thì Hiện tại đơn & Hiện tại tiếp diễn',
      'Ôn tập giới từ chỉ vị trí & sở hữu cách',
      'Luyện phát âm đuôi -s/-es và từ vựng miêu tả tính cách',
    ];

    final List aiSteps = isFinalSummary
        ? const [
      {
        'step': 'Chặng 1',
        'name': 'Hệ thống hóa Từ vựng & Phát âm Học kỳ I - II',
        'desc': 'Ôn tập 120 từ vựng cốt lõi và luyện nghe phản xạ theo chủ đề SGK.',
      },
      {
        'step': 'Chặng 2',
        'name': 'Luyện tập chuyên sâu Ngữ pháp trọng tâm',
        'desc': 'Bài tập khắc phục các lỗi sai phổ biến qua 4 đợt Review định kỳ.',
      },
      {
        'step': 'Chặng 3',
        'name': 'Đề thi thử tổng hợp chuẩn cấu trúc lớp 6',
        'desc': 'Đánh giá toàn diện 4 kỹ năng trước khi chuyển cấp độ.',
      },
    ]
        : const [
      {
        'step': 'Bước 1',
        'name': 'Ôn lại lý thuyết & lỗi sai từ bài kiểm tra',
        'desc': 'Xem giải thích chi tiết các câu làm sai trong Unit 1 - 3.',
      },
      {
        'step': 'Bước 2',
        'name': 'Bài luyện tập củng cố cá nhân hóa (15 câu)',
        'desc': 'Tập trung vào thì Hiện tại đơn và giới từ chỉ nơi chốn.',
      },
      {
        'step': 'Bước 3',
        'name': 'Bài kiểm tra đánh giá lại sau bổ trợ',
        'desc': 'Xác nhận mức độ cải thiện kiến thức trước khi sang Unit 4.',
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: _textPrimary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Chi tiết lộ trình AI',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: _textPrimary),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 1. Banner tổng quan chặng lộ trình
            Container(
              padding: const EdgeInsets.all(20),
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
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Center(
                      child: Text(
                        badge,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      alignment: Alignment.centerLeft,
                      child: Text(
                        title,
                        maxLines: 1,
                        style: const TextStyle(
                          fontSize: 15.5,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),

            // 2. Trọng tâm kiến thức cần bổ trợ
            const Text(
              'Kiến thức trọng tâm cần củng cố',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: _textPrimary),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  for (int i = 0; i < focusTopics.length; i++) ...[
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.only(top: 2),
                          child: Icon(Icons.auto_awesome_rounded, size: 16, color: _primaryBlue),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            focusTopics[i].toString(),
                            style: const TextStyle(
                              fontSize: 13,
                              color: _textPrimary,
                              fontWeight: FontWeight.w600,
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
                    ),
                    if (i != focusTopics.length - 1) const SizedBox(height: 10),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 22),

            // 3. Các bước thực hiện trong lộ trình (Đã bỏ trạng thái)
            const Text(
              'Các bước học tập đề xuất',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: _textPrimary),
            ),
            const SizedBox(height: 10),
            for (int i = 0; i < aiSteps.length; i++) ...[
              Builder(
                builder: (_) {
                  final step = aiSteps[i] as Map;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: _primaryBlue.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            step['step'].toString(),
                            style: const TextStyle(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w800,
                              color: _primaryBlue,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          step['name'].toString(),
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: _textPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          step['desc'].toString(),
                          style: const TextStyle(
                            fontSize: 12.5,
                            color: _textSecondary,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}