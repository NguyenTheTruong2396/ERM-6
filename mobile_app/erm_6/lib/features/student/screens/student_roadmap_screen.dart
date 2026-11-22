import 'package:flutter/material.dart';
import 'roadmap_detail_screen.dart';

class StudentRoadmapScreen extends StatelessWidget {
  const StudentRoadmapScreen({super.key});

  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _completedGreen = Color(0xFF047857);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  void _openRoadmapPage(BuildContext context, Map item) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => RoadmapDetailScreen(
          badge: item['badge'].toString(),
          title: item['title'].toString(),
          subtitle: item['subtitle'].toString(),
          focus: item['focus'].toString(),
          advice: item['advice'].toString(),
          tasks: item['tasks'] as List,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const roadmapItems = [
      {'badge': '1', 'title': 'Unit 1: My New School', 'status': 'done'},
      {'badge': '2', 'title': 'Unit 2: My House', 'status': 'done'},
      {'badge': '3', 'title': 'Unit 3: My Friends', 'status': 'current'},
      {
        'badge': 'R1',
        'title': 'Review 1 • Lộ trình bổ trợ Unit 1 - 3',
        'subtitle': 'CỘT MỐC LỘ TRÌNH SỐ 1',
        'status': 'review',
        'focus': 'Tổng hợp từ vựng trường học, nhà cửa, bạn bè • Thì Hiện tại đơn, Hiện tại tiếp diễn & Giới từ chỉ nơi chốn.',
        'advice': 'Sau khi hoàn thành Unit 1 - 3, hệ thống rà soát 2 điểm cần củng cố: chia động từ ngôi thứ 3 số ít và giới từ chỉ vị trí trước khi bước sang Unit 4.',
        'tasks': [
          {'name': 'Chặng 1: Củng cố thì Hiện tại đơn', 'detail': 'Ôn quy tắc thêm -s/-es và trạng từ chỉ tần suất', 'done': true},
          {'name': 'Chặng 2: Phân biệt giới từ nơi chốn', 'detail': 'Luyện bài tập chọn in / on / at / under / next to', 'done': false},
          {'name': 'Chặng 3: Bài kiểm tra tổng hợp Review 1', 'detail': 'Đánh giá mức độ đạt chuẩn cụm Unit 1 - 3', 'done': false},
        ],
      },
      {'badge': '4', 'title': 'Unit 4: My Neighbourhood', 'status': 'locked'},
      {'badge': '5', 'title': 'Unit 5: Natural Wonders of Viet Nam', 'status': 'locked'},
      {'badge': '6', 'title': 'Unit 6: Our Tet Holiday', 'status': 'locked'},
      {
        'badge': 'R2',
        'title': 'Review 2 • Lộ trình bổ trợ Unit 4 - 6',
        'subtitle': 'CỘT MỐC LỘ TRÌNH SỐ 2',
        'status': 'review',
        'focus': 'Tổng hợp cụm Unit 4 - 5 - 6: So sánh hơn, Danh từ đếm được / không đếm được, Must / Should.',
        'advice': 'Cột mốc đánh giá cuối Học kỳ I giúp cân bằng kiến thức ngữ pháp và từ vựng trước khi chuyển sang Tập 2.',
        'tasks': [
          {'name': 'Chặng 1: So sánh hơn của tính từ ngắn', 'detail': 'Rà soát quy tắc gấp đôi phụ âm và tính từ bất quy tắc', 'done': false},
          {'name': 'Chặng 2: Động từ khuyết thiếu Must / Should', 'detail': 'Luyện tình huống giao tiếp đưa ra lời khuyên', 'done': false},
          {'name': 'Chặng 3: Bài kiểm tra tổng hợp Review 2', 'detail': 'Tổng kết năng lực Học kỳ I', 'done': false},
        ],
      },
      {'badge': '7', 'title': 'Unit 7: Television', 'status': 'locked'},
      {'badge': '8', 'title': 'Unit 8: Sports and Games', 'status': 'locked'},
      {'badge': '9', 'title': 'Unit 9: Cities of the World', 'status': 'locked'},
      {
        'badge': 'R3',
        'title': 'Review 3 • Lộ trình bổ trợ Unit 7 - 9',
        'subtitle': 'CỘT MỐC LỘ TRÌNH SỐ 3',
        'status': 'review',
        'focus': 'Tổng hợp cụm Unit 7 - 8 - 9: Từ để hỏi Wh-, Liên từ, Thì Quá khứ đơn & Đại từ sở hữu.',
        'advice': 'Trọng tâm rà soát bảng động từ bất quy tắc ở thì Quá khứ đơn và phân biệt tính từ sở hữu / đại từ sở hữu.',
        'tasks': [
          {'name': 'Chặng 1: Thì Quá khứ đơn (Past Simple)', 'detail': 'Luyện chia động từ có quy tắc và bất quy tắc', 'done': false},
          {'name': 'Chặng 2: Tính từ sở hữu & Đại từ sở hữu', 'detail': 'Phân biệt my/mine, your/yours, her/hers...', 'done': false},
          {'name': 'Chặng 3: Bài kiểm tra tổng hợp Review 3', 'detail': 'Cập nhật lộ trình giữa Học kỳ II', 'done': false},
        ],
      },
      {'badge': '10', 'title': 'Unit 10: Our Houses in the Future', 'status': 'locked'},
      {'badge': '11', 'title': 'Unit 11: Our Greener World', 'status': 'locked'},
      {'badge': '12', 'title': 'Unit 12: Robots', 'status': 'locked'},
      {
        'badge': 'R4',
        'title': 'Review 4 • Lộ trình bổ trợ Unit 10 - 12',
        'subtitle': 'CỘT MỐC LỘ TRÌNH SỐ 4',
        'status': 'review',
        'focus': 'Tổng hợp cụm Unit 10 - 11 - 12: Thì Tương lai đơn (will), Câu điều kiện loại 1 & So sánh nhất.',
        'advice': 'Củng cố cấu trúc câu điều kiện loại 1 và so sánh nhất để sẵn sàng cho kỳ thi cuối năm lớp 6.',
        'tasks': [
          {'name': 'Chặng 1: Câu điều kiện loại 1 (First Conditional)', 'detail': 'Luyện chia thì ở mệnh đề If và mệnh đề chính', 'done': false},
          {'name': 'Chặng 2: So sánh nhất của tính từ ngắn', 'detail': 'Phân biệt với so sánh hơn đã học ở Học kỳ I', 'done': false},
          {'name': 'Chặng 3: Bài kiểm tra tổng hợp Review 4', 'detail': 'Hoàn thiện kiến thức Tập 2', 'done': false},
        ],
      },
      {
        'badge': '★',
        'title': 'Lộ trình tổng kết (12 Unit)',
        'subtitle': 'TỔNG KẾT TOÀN NĂM HỌC LỚP 6',
        'status': 'final',
        'focus': 'Hệ thống hóa toàn bộ 12 chủ điểm từ vựng, 12 chuyên đề ngữ pháp và 4 kỹ năng Nghe - Nói - Đọc - Viết.',
        'advice': 'Bức tranh tổng thể quá trình học tập cả năm giúp em tự tin nắm vững nền tảng Tiếng Anh 6.',
        'tasks': [
          {'name': 'Giai đoạn 1: Nền tảng Học kỳ I (Unit 1 - 6)', 'detail': 'Đang hoàn thành tiến độ Tập 1', 'done': false},
          {'name': 'Giai đoạn 2: Mở rộng Học kỳ II (Unit 7 - 12)', 'detail': 'Mở khóa sau khi hoàn thành Tập 1', 'done': false},
          {'name': 'Giai đoạn 3: Đánh giá tổng kết cả năm', 'detail': 'Hoàn thành toàn bộ lộ trình ERM-6', 'done': false},
        ],
      },
    ];

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 115),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (int i = 0; i < roadmapItems.length; i++) ...[
            Builder(
              builder: (_) {
                final item = roadmapItems[i];
                final isLast = i == roadmapItems.length - 1;
                final status = item['status'].toString();
                final isReview = status == 'review';
                final isFinal = status == 'final';
                final isDone = status == 'done';
                final isCurrent = status == 'current';

                final bool isClickableMilestone = isReview || isFinal;

                Color circleBg = Colors.white;
                Color circleBorder = const Color(0xFFCBD5E1);
                Color circleText = _textSecondary;

                if (isDone) {
                  circleBg = const Color(0xFFECFDF5);
                  circleBorder = _completedGreen;
                  circleText = _completedGreen;
                } else if (isCurrent) {
                  circleBg = const Color(0xFFEFF6FF);
                  circleBorder = _primaryBlue;
                  circleText = _primaryBlue;
                }

                return IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Cột trục tròn đối xứng trên/dưới để hình tròn luôn nằm chính giữa thẻ
                      SizedBox(
                        width: 38,
                        child: Column(
                          children: [
                            Expanded(
                              child: Container(
                                width: 2,
                                color: i == 0
                                    ? Colors.transparent
                                    : (isDone || isCurrent
                                    ? _completedGreen.withValues(alpha: 0.4)
                                    : const Color(0xFFE2E8F0)),
                              ),
                            ),
                            Container(
                              width: 34,
                              height: 34,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: isClickableMilestone
                                    ? const LinearGradient(colors: [_primaryBlue, _gradientCyan])
                                    : null,
                                color: isClickableMilestone ? null : circleBg,
                                border: isClickableMilestone
                                    ? null
                                    : Border.all(color: circleBorder, width: 1.6),
                              ),
                              child: Center(
                                child: Text(
                                  item['badge'].toString(),
                                  style: TextStyle(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w900,
                                    color: isClickableMilestone ? Colors.white : circleText,
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: Container(
                                width: 2,
                                color: isLast
                                    ? Colors.transparent
                                    : (isDone
                                    ? _completedGreen.withValues(alpha: 0.4)
                                    : const Color(0xFFE2E8F0)),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),

                      // Thẻ nội dung căn khoảng cách đều trên/dưới (vertical: 6)
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          child: GestureDetector(
                            onTap: isClickableMilestone
                                ? () => _openRoadmapPage(context, item)
                                : null,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
                              decoration: BoxDecoration(
                                gradient: isClickableMilestone
                                    ? const LinearGradient(
                                  colors: [_primaryBlue, _gradientCyan],
                                  begin: Alignment.centerLeft,
                                  end: Alignment.centerRight,
                                )
                                    : null,
                                color: isClickableMilestone ? null : Colors.white,
                                borderRadius: BorderRadius.circular(18),
                                border: isClickableMilestone
                                    ? null
                                    : Border.all(
                                  color: isCurrent ? _primaryBlue : const Color(0xFFE2E8F0),
                                  width: isCurrent ? 1.4 : 1.0,
                                ),
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      item['title'].toString(),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        fontSize: 13.5,
                                        fontWeight: FontWeight.w900,
                                        color: isClickableMilestone ? Colors.white : _textPrimary,
                                      ),
                                    ),
                                  ),
                                  if (isClickableMilestone) ...[
                                    const SizedBox(width: 8),
                                    const Icon(
                                      Icons.arrow_forward_ios_rounded,
                                      size: 15,
                                      color: Colors.white,
                                    ),
                                  ],
                                ],
                              ),
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
        ],
      ),
    );
  }
}