import 'package:flutter/material.dart';
import '../exam/unit_test_screen.dart';
import '../sgk_book_reader_screen.dart';
import 'grammar_lesson_screen.dart';
import 'skills_practice_screen.dart';
import 'vocabulary_flashcard_screen.dart';

class UnitDetailScreen extends StatelessWidget {
  final int unitNumber;
  final String unitTitle;
  final String? initialLessonTitle;

  const UnitDetailScreen({
    super.key,
    required this.unitNumber,
    required this.unitTitle,
    this.initialLessonTitle,
  });

  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  @override
  Widget build(BuildContext context) {
    // Cấu trúc 7 bài học nhỏ trong 1 Unit theo chuẩn SGK Tiếng Anh 6
    const subLessons = [
      {
        'lesson': 'Lesson 1: Getting Started',
        'pages': 'Trang 6 - 7',
        'startPage': 6,
        'desc': 'Hội thoại mở đầu & Khởi động chủ đề bài học',
        'type': 'skills',
      },
      {
        'lesson': 'Lesson 2: A Closer Look 1',
        'pages': 'Trang 8',
        'startPage': 8,
        'desc': 'Từ vựng trọng tâm & Luyện phát âm chuẩn',
        'type': 'vocab',
      },
      {
        'lesson': 'Lesson 3: A Closer Look 2',
        'pages': 'Trang 9 - 10',
        'startPage': 9,
        'desc': 'Kiến thức ngữ pháp & Bài tập vận dụng',
        'type': 'grammar',
      },
      {
        'lesson': 'Lesson 4: Communication',
        'pages': 'Trang 11',
        'startPage': 11,
        'desc': 'Tiếng Anh giao tiếp thực tế hàng ngày',
        'type': 'skills',
      },
      {
        'lesson': 'Lesson 5: Skills 1 (Reading & Speaking)',
        'pages': 'Trang 12',
        'startPage': 12,
        'desc': 'Luyện kỹ năng Đọc hiểu & Thực hành Nói',
        'type': 'skills',
      },
      {
        'lesson': 'Lesson 6: Skills 2 (Listening & Writing)',
        'pages': 'Trang 13',
        'startPage': 13,
        'desc': 'Luyện kỹ năng Nghe hiểu & Viết đoạn văn',
        'type': 'skills',
      },
      {
        'lesson': 'Lesson 7: Looking Back & Project',
        'pages': 'Trang 14 - 15',
        'startPage': 14,
        'desc': 'Ôn tập tổng hợp kiến thức & Dự án nhóm',
        'type': 'grammar',
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
        title: Text(
          unitTitle,
          style: const TextStyle(fontSize: 16.5, fontWeight: FontWeight.w900, color: _textPrimary),
        ),
        actions: [
          if (unitNumber <= 6)
            TextButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const SgkBookReaderScreen(volume: 1, initialPage: 6),
                  ),
                );
              },
              icon: const Icon(Icons.menu_book_rounded, size: 18, color: _primaryBlue),
              label: const Text(
                'Xem sách',
                style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: _primaryBlue),
              ),
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Banner tổng quan Unit
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [_primaryBlue, _gradientCyan],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(22),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'UNIT $unitNumber • CHƯƠNG TRÌNH SGK',
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.white70),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    unitTitle,
                    style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w900, color: Colors.white),
                  ),
                  if (initialLessonTitle != null) ...[
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        'Đang mở từ sách: $initialLessonTitle',
                        style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 22),

            const Text(
              'Các bài học nhỏ trong Unit',
              style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w900, color: _textPrimary),
            ),
            const SizedBox(height: 12),

            // Danh sách 7 bài học nhỏ theo từng trang sách
            for (int i = 0; i < subLessons.length; i++) ...[
              Builder(
                builder: (_) {
                  final item = subLessons[i];
                  final lessonName = item['lesson'].toString();
                  final pages = item['pages'].toString();
                  final startPage = item['startPage'] as int;
                  final desc = item['desc'].toString();
                  final type = item['type'].toString();

                  final isHighlighted = initialLessonTitle != null &&
                      initialLessonTitle!.contains(lessonName);

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: isHighlighted ? _primaryBlue : const Color(0xFFE2E8F0),
                        width: isHighlighted ? 1.8 : 1,
                      ),
                    ),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(18),
                      onTap: () {
                        if (type == 'vocab') {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => VocabularyFlashcardScreen(unitTitle: '$unitTitle • $lessonName'),
                            ),
                          );
                        } else if (type == 'grammar') {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => GrammarLessonScreen(unitTitle: '$unitTitle • $lessonName'),
                            ),
                          );
                        } else {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => SkillsPracticeScreen(unitTitle: '$unitTitle • $lessonName'),
                            ),
                          );
                        }
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(14),
                        child: Row(
                          children: [
                            Container(
                              width: 42,
                              height: 42,
                              decoration: BoxDecoration(
                                color: _primaryBlue.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Center(
                                child: Text(
                                  '${i + 1}',
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w900,
                                    color: _primaryBlue,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          lessonName,
                                          style: const TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w900,
                                            color: _textPrimary,
                                          ),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFF1F5F9),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          pages,
                                          style: const TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w800,
                                            color: _primaryBlue,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    desc,
                                    style: const TextStyle(fontSize: 12, color: _textSecondary),
                                  ),
                                ],
                              ),
                            ),
                            if (unitNumber == 1) ...[
                              const SizedBox(width: 6),
                              IconButton(
                                tooltip: 'Mở $pages',
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => SgkBookReaderScreen(
                                        volume: 1,
                                        initialPage: startPage,
                                      ),
                                    ),
                                  );
                                },
                                icon: const Icon(Icons.menu_book_outlined, size: 20, color: _textSecondary),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],

            const SizedBox(height: 10),
            const Text(
              'Kiểm tra tổng hợp cuối Unit',
              style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w900, color: _textPrimary),
            ),
            const SizedBox(height: 10),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => UnitTestScreen(unitTitle: unitTitle),
                  ),
                );
              },
              icon: const Icon(Icons.quiz_rounded, size: 20),
              label: const Text(
                'Làm bài kiểm tra Unit Test',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF059669),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 0,
              ),
            ),
          ],
        ),
      ),
    );
  }
}