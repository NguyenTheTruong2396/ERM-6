import 'package:flutter/material.dart';

class FlashcardItemWidget extends StatelessWidget {
  final String word;
  final String ipa;
  final String type;
  final String meaning;
  final String example;
  final bool isFlipped;
  final VoidCallback onFlip;
  final VoidCallback onPlayAudio;

  const FlashcardItemWidget({
    super.key,
    required this.word,
    required this.ipa,
    required this.type,
    required this.meaning,
    required this.example,
    required this.isFlipped,
    required this.onFlip,
    required this.onPlayAudio,
  });

  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onFlip,
      child: Container(
        height: 270,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: isFlipped
              ? const LinearGradient(
            colors: [_primaryBlue, _gradientCyan],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          )
              : null,
          color: isFlipped ? null : Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: isFlipped ? null : Border.all(color: const Color(0xFFE2E8F0), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: _primaryBlue.withValues(alpha: 0.08),
              blurRadius: 16,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isFlipped ? Colors.white.withValues(alpha: 0.2) : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    isFlipped ? 'Nghĩa tiếng Việt' : type,
                    style: TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w800,
                      color: isFlipped ? Colors.white : _primaryBlue,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: onPlayAudio,
                  icon: Icon(
                    Icons.volume_up_rounded,
                    color: isFlipped ? Colors.white : _primaryBlue,
                  ),
                ),
              ],
            ),
            if (!isFlipped) ...[
              Column(
                children: [
                  Text(
                    word,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: _textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    ipa,
                    style: const TextStyle(
                      fontSize: 16,
                      color: _textSecondary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ] else ...[
              Column(
                children: [
                  Text(
                    meaning,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '"$example"',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 13.5,
                      color: Colors.white70,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ),
            ],
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.touch_app_rounded,
                  size: 15,
                  color: isFlipped ? Colors.white70 : _textSecondary,
                ),
                const SizedBox(width: 6),
                Text(
                  'Chạm vào thẻ để lật mặt',
                  style: TextStyle(
                    fontSize: 12,
                    color: isFlipped ? Colors.white70 : _textSecondary,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}