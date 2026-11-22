import 'package:flutter/material.dart';

class TestResultScreen extends StatelessWidget {
  final String unitTitle;
  final int correctCount;
  final int totalQuestions;

  const TestResultScreen({
    super.key,
    required this.unitTitle,
    required this.correctCount,
    required this.totalQuestions,
  });

  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  @override
  Widget build(BuildContext context) {
    final score = ((correctCount / totalQuestions) * 10).toStringAsFixed(1);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        automaticallyImplyLeading: false,
        title: const Text(
          'Kết quả & Phân tích AI',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: _textPrimary),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Bảng điểm thang 10
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [_primaryBlue, _gradientCyan],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                children: [
                  Text(
                    unitTitle,
                    style: const TextStyle(fontSize: 14, color: Colors.white70, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    '$score / 10',
                    style: const TextStyle(fontSize: 38, fontWeight: FontWeight.w900, color: Colors.white),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Trả lời đúng $correctCount / $totalQuestions câu hỏi',
                    style: const TextStyle(fontSize: 13.5, color: Colors.white, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),

            // Phân tích điểm mạnh / lỗ hổng
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Đánh giá năng lực tự động',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: _textPrimary),
                  ),
                  SizedBox(height: 12),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 18),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Điểm mạnh: Nắm vững từ vựng chủ đề trường học và tính từ miêu tả.',
                          style: TextStyle(fontSize: 13, color: _textPrimary, height: 1.4),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 10),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.error_outline_rounded, color: Color(0xFFF59E0B), size: 18),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Cần lưu ý: Phân biệt thì Hiện tại đơn và Hiện tại tiếp diễn khi có dấu hiệu "Look!".',
                          style: TextStyle(fontSize: 13, color: _textSecondary, height: 1.4),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: _primaryBlue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text(
                'QUAY LẠI BÀI HỌC',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900),
              ),
            ),
          ],
        ),
      ),
    );
  }
}