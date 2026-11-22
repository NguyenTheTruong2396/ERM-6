import 'package:flutter/material.dart';
import '../../widgets/flashcard_item_widget.dart';

class VocabularyFlashcardScreen extends StatefulWidget {
  final String unitTitle;

  const VocabularyFlashcardScreen({
    super.key,
    required this.unitTitle,
  });

  @override
  State<VocabularyFlashcardScreen> createState() => _VocabularyFlashcardScreenState();
}

class _VocabularyFlashcardScreenState extends State<VocabularyFlashcardScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  final List _vocabList = const [
    {
      'word': 'uniform',
      'ipa': '/ˈjuːnɪfɔːm/',
      'type': 'Danh từ (n)',
      'meaning': 'Bộ đồng phục',
      'example': 'Students wear their school uniform on Mondays.',
    },
    {
      'word': 'calculator',
      'ipa': '/ˈkælkjuleɪtə(r)/',
      'type': 'Danh từ (n)',
      'meaning': 'Máy tính cầm tay',
      'example': 'I need a calculator for my Maths lesson.',
    },
    {
      'word': 'compass',
      'ipa': '/ˈkʌmpəs/',
      'type': 'Danh từ (n)',
      'meaning': 'Com-pa vẽ đường tròn',
      'example': 'Can I borrow your compass?',
    },
    {
      'word': 'subject',
      'ipa': '/ˈsʌbdʒɪkt/',
      'type': 'Danh từ (n)',
      'meaning': 'Môn học',
      'example': 'English is my favourite subject at school.',
    },
  ];

  int _currentIndex = 0;
  bool _isFlipped = false;
  int _selectedOption = -1;

  @override
  Widget build(BuildContext context) {
    final current = _vocabList[_currentIndex] as Map;

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
          'Từ vựng (Vocabulary)',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: _textPrimary),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  widget.unitTitle,
                  style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: _primaryBlue),
                ),
                Text(
                  'Thẻ ${_currentIndex + 1} / ${_vocabList.length}',
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: _textSecondary),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Thẻ Flashcard
            FlashcardItemWidget(
              word: current['word'].toString(),
              ipa: current['ipa'].toString(),
              type: current['type'].toString(),
              meaning: current['meaning'].toString(),
              example: current['example'].toString(),
              isFlipped: _isFlipped,
              onFlip: () => setState(() => _isFlipped = !_isFlipped),
              onPlayAudio: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Đang phát âm mẫu: ${current['word']}'),
                    duration: const Duration(seconds: 1),
                  ),
                );
              },
            ),
            const SizedBox(height: 16),

            // Nút chuyển thẻ Trước / Sau
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _currentIndex > 0
                        ? () => setState(() {
                      _currentIndex--;
                      _isFlipped = false;
                    })
                        : null,
                    icon: const Icon(Icons.arrow_back_rounded, size: 18),
                    label: const Text('Thẻ trước'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _currentIndex < _vocabList.length - 1
                        ? () => setState(() {
                      _currentIndex++;
                      _isFlipped = false;
                    })
                        : null,
                    icon: const Icon(Icons.arrow_forward_rounded, size: 18),
                    label: const Text('Thẻ tiếp'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _primaryBlue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 26),

            // Luyện tập từ vựng nhanh
            const Text(
              'Luyện tập từ vựng nhanh',
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
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Từ nào có nghĩa là "Bộ đồng phục"?',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _textPrimary),
                  ),
                  const SizedBox(height: 12),
                  for (int i = 0; i < 3; i++) ...[
                    Builder(
                      builder: (_) {
                        const options = ['A. calculator', 'B. uniform', 'C. compass'];
                        final isSelected = _selectedOption == i;
                        final isCorrect = i == 1;
                        return GestureDetector(
                          onTap: () => setState(() => _selectedOption = i),
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
                              options[i],
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