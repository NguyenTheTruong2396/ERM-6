import 'dart:async';
import 'package:flutter/material.dart';
import 'test_result_screen.dart';

class UnitTestScreen extends StatefulWidget {
  final String unitTitle;

  const UnitTestScreen({
    super.key,
    required this.unitTitle,
  });

  @override
  State<UnitTestScreen> createState() => _UnitTestScreenState();
}

class _UnitTestScreenState extends State<UnitTestScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _textPrimary = Color(0xFF0F172A);

  int _secondsLeft = 900; // 15 phút
  Timer? _timer;
  final Map _userAnswers = {};

  final List _questions = const [
    {
      'q': '1. We ______ new subjects like physics and science at secondary school.',
      'options': ['have', 'has', 'having', 'to have'],
      'correct': 0,
    },
    {
      'q': '2. Vy is very ______. She likes meeting new people and talking to friends.',
      'options': ['shy', 'friendly', 'lazy', 'quiet'],
      'correct': 1,
    },
    {
      'q': '3. Look! The students ______ football in the schoolyard.',
      'options': ['play', 'plays', 'are playing', 'played'],
      'correct': 2,
    },
  ];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_secondsLeft > 0) {
        setState(() => _secondsLeft--);
      } else {
        t.cancel();
        _submitTest();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  String _formatTime(int totalSeconds) {
    final m = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final s = (totalSeconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  void _submitTest() {
    _timer?.cancel();
    int correctCount = 0;
    for (int i = 0; i < _questions.length; i++) {
      final q = _questions[i] as Map;
      if (_userAnswers[i] == q['correct']) {
        correctCount++;
      }
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => TestResultScreen(
          unitTitle: widget.unitTitle,
          correctCount: correctCount,
          totalQuestions: _questions.length,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close_rounded, color: _textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Kiểm tra Unit Test',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: _textPrimary),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16, top: 10, bottom: 10),
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: const Color(0xFFFFE4E6),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: Text(
                _formatTime(_secondsLeft),
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFFBE123C)),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            for (int qIdx = 0; qIdx < _questions.length; qIdx++) ...[
              Builder(
                builder: (_) {
                  final item = _questions[qIdx] as Map;
                  final opts = item['options'] as List;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item['q'].toString(),
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _textPrimary),
                        ),
                        const SizedBox(height: 12),
                        for (int oIdx = 0; oIdx < opts.length; oIdx++) ...[
                          GestureDetector(
                            onTap: () => setState(() => _userAnswers[qIdx] = oIdx),
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                              decoration: BoxDecoration(
                                color: _userAnswers[qIdx] == oIdx ? const Color(0xFFF0F7FF) : const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: _userAnswers[qIdx] == oIdx ? _primaryBlue : const Color(0xFFE2E8F0),
                                ),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    _userAnswers[qIdx] == oIdx
                                        ? Icons.radio_button_checked_rounded
                                        : Icons.radio_button_unchecked_rounded,
                                    size: 18,
                                    color: _userAnswers[qIdx] == oIdx ? _primaryBlue : const Color(0xFF94A3B8),
                                  ),
                                  const SizedBox(width: 10),
                                  Text(
                                    opts[oIdx].toString(),
                                    style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  );
                },
              ),
            ],
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _submitTest,
              style: ElevatedButton.styleFrom(
                backgroundColor: _primaryBlue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text(
                'NỘP BÀI & XEM ĐIỂM',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900),
              ),
            ),
          ],
        ),
      ),
    );
  }
}