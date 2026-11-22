import 'package:flutter/material.dart';

class SkillsPracticeScreen extends StatefulWidget {
  final String unitTitle;

  const SkillsPracticeScreen({
    super.key,
    required this.unitTitle,
  });

  @override
  State<SkillsPracticeScreen> createState() => _SkillsPracticeScreenState();
}

class _SkillsPracticeScreenState extends State<SkillsPracticeScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  int _selectedTab = 0; // 0: Nghe, 1: Nói, 2: Đọc, 3: Viết
  double _playbackSpeed = 1.0;
  bool _isRecording = false;
  bool _hasRecorded = false;
  final TextEditingController _writingController = TextEditingController();

  @override
  void dispose() {
    _writingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const tabs = ['Nghe', 'Nói', 'Đọc', 'Viết'];

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
          'Luyện 4 kỹ năng',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: _textPrimary),
        ),
      ),
      body: Column(
        children: [
          // Thanh chuyển đổi 4 kỹ năng
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 14),
            child: Row(
              children: [
                for (int i = 0; i < tabs.length; i++) ...[
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedTab = i),
                      child: Container(
                        margin: EdgeInsets.only(right: i < 3 ? 8 : 0),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: _selectedTab == i ? _primaryBlue : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: Text(
                            tabs[i],
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: _selectedTab == i ? Colors.white : _textSecondary,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),

          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: _buildSkillBody(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSkillBody() {
    switch (_selectedTab) {
      case 0:
        return _buildListeningView();
      case 1:
        return _buildSpeakingView();
      case 2:
        return _buildReadingView();
      default:
        return _buildWritingView();
    }
  }

  // 1. Kỹ năng Nghe
  Widget _buildListeningView() {
    return Container(
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
            'Nghe hội thoại & chọn đáp án đúng',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: _textPrimary),
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF0F7FF),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                IconButton.filled(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Đang phát audio ở tốc độ ${_playbackSpeed}x')),
                    );
                  },
                  style: IconButton.styleFrom(backgroundColor: _primaryBlue),
                  icon: const Icon(Icons.play_arrow_rounded, color: Colors.white),
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    'Track 01 • A Special Day',
                    style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: _textPrimary),
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _playbackSpeed = _playbackSpeed == 1.0 ? 0.8 : 1.0;
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: _primaryBlue),
                    ),
                    child: Text(
                      '${_playbackSpeed}x',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: _primaryBlue),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Câu hỏi: Phong wears his uniform on ______.',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: _textPrimary),
          ),
          const SizedBox(height: 8),
          const Text(
            '• True   /   • False',
            style: TextStyle(fontSize: 13.5, color: _textSecondary, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }

  // 2. Kỹ năng Nói
  Widget _buildSpeakingView() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          const Text(
            'Đọc to câu mẫu dưới đây để AI chấm phát âm',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _textSecondary),
          ),
          const SizedBox(height: 16),
          const Text(
            '"My new school has a large playground."',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: _textPrimary),
          ),
          const SizedBox(height: 24),
          GestureDetector(
            onTap: () {
              setState(() {
                _isRecording = !_isRecording;
                if (!_isRecording) _hasRecorded = true;
              });
            },
            child: Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: _isRecording ? const Color(0xFFF43F5E) : _primaryBlue,
                shape: BoxShape.circle,
              ),
              child: Icon(
                _isRecording ? Icons.stop_rounded : Icons.mic_rounded,
                color: Colors.white,
                size: 34,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            _isRecording ? 'Đang thu âm... Chạm để dừng' : 'Chạm micro để bắt đầu đọc',
            style: const TextStyle(fontSize: 12.5, color: _textSecondary, fontWeight: FontWeight.w600),
          ),
          if (_hasRecorded) ...[
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFECFDF5),
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Column(
                children: [
                  Text(
                    'Điểm phát âm: 88 / 100',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF059669)),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Chú ý nhấn rõ âm cuối của từ "playground".',
                    style: TextStyle(fontSize: 12.5, color: Color(0xFF065F46)),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  // 3. Kỹ năng Đọc
  Widget _buildReadingView() {
    return Container(
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
            'Bài đọc: Sunrise Boarding School',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: _primaryBlue),
          ),
          SizedBox(height: 10),
          Text(
            'Sunrise is a boarding school in Sydney. Students study and live there. About 1,200 boys and girls go to Sunrise. It has students from all over Australia. They study subjects like maths, science and English.',
            style: TextStyle(fontSize: 14, color: _textPrimary, height: 1.6),
          ),
          SizedBox(height: 16),
          Divider(color: Color(0xFFE2E8F0)),
          SizedBox(height: 10),
          Text(
            'Câu hỏi đọc hiểu: Where is Sunrise school?',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _textPrimary),
          ),
          SizedBox(height: 6),
          Text(
            'Gợi ý trả lời: It is in Sydney, Australia.',
            style: TextStyle(fontSize: 13, color: _textSecondary),
          ),
        ],
      ),
    );
  }

  // 4. Kỹ năng Viết
  Widget _buildWritingView() {
    return Container(
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
            'Sắp xếp các từ gợi ý thành câu hoàn chỉnh:',
            style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w800, color: _textPrimary),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text(
              'school / is / big / My / and / modern / .',
              style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w700, color: _primaryBlue),
            ),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _writingController,
            decoration: InputDecoration(
              hintText: 'Nhập câu trả lời của em...',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
            ),
          ),
          const SizedBox(height: 14),
          ElevatedButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Đáp án chuẩn: My school is big and modern.')),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: _primaryBlue,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: const Text('Kiểm tra câu viết', style: TextStyle(fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );
  }
}