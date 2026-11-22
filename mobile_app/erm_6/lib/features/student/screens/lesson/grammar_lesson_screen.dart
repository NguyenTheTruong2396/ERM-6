import 'package:flutter/material.dart';

class GrammarLessonScreen extends StatefulWidget {
  final String unitTitle;

  const GrammarLessonScreen({
    super.key,
    required this.unitTitle,
  });

  @override
  State<GrammarLessonScreen> createState() => _GrammarLessonScreenState();
}

class _GrammarLessonScreenState extends State<GrammarLessonScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  int _selectedAnswer = -1;

  @override
  Widget build(BuildContext context) {
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
          'Ngữ pháp (Grammar)',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: _textPrimary),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Khung lý thuyết & công thức
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
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
                    child: const Text(
                      'Thì Hiện tại đơn (Present Simple)',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: _primaryBlue),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    '1. Công thức động từ thường:',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _textPrimary),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0F7FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      '(+) S + V(s/es) + O\n(-) S + do/does + not + V-inf\n(?) Do/Does + S + V-inf?',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: _primaryBlue, height: 1.5),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    '2. Dấu hiệu nhận biết:',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _textPrimary),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'always, usually, often, sometimes, seldom, never, every day / week / month.',
                    style: TextStyle(fontSize: 13, color: _textSecondary, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),

            // Luyện tập ngữ pháp
            const Text(
              'Luyện tập chia động từ',
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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Lan usually ______ (go) to school by bike every morning.',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _textPrimary, height: 1.4),
                  ),
                  const SizedBox(height: 12),
                  for (int i = 0; i < 4; i++) ...[
                    Builder(
                      builder: (_) {
                        const choices = ['A. go', 'B. goes', 'C. going', 'D. went'];
                        final isSelected = _selectedAnswer == i;
                        final isCorrect = i == 1;
                        return GestureDetector(
                          onTap: () => setState(() => _selectedAnswer = i),
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? (isCorrect ? const Color(0xFFECFDF5) : const Color(0xFFFFE4E6))
                                  : const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isSelected
                                    ? (isCorrect ? const Color(0xFF10B981) : const Color(0xFFF43F5E))
                                    : const Color(0xFFE2E8F0),
                              ),
                            ),
                            child: Text(
                              choices[i],
                              style: TextStyle(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w700,
                                color: isSelected
                                    ? (isCorrect ? const Color(0xFF059669) : const Color(0xFFBE123C))
                                    : _textPrimary,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}