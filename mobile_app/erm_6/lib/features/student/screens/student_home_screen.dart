import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'lesson/unit_detail_screen.dart';
import 'sgk_book_reader_screen.dart';

class StudentHomeScreen extends StatefulWidget {
  final String studentName;
  final bool isSchoolStudent;
  final ValueChanged<int> onSelectVolume;

  const StudentHomeScreen({
    super.key,
    required this.studentName,
    required this.isSchoolStudent,
    required this.onSelectVolume,
  });

  @override
  State<StudentHomeScreen> createState() => _StudentHomeScreenState();
}

class _StudentHomeScreenState extends State<StudentHomeScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  late final PageController _bookPageController;
  double _currentPage = 0.0;

  @override
  void initState() {
    super.initState();
    _bookPageController = PageController(viewportFraction: 0.64);
    _bookPageController.addListener(() {
      if (_bookPageController.hasClients) {
        setState(() {
          _currentPage = _bookPageController.page ?? 0.0;
        });
      }
    });
  }

  @override
  void dispose() {
    _bookPageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const books = [
      {
        'volume': 1,
        'title': 'Tiếng Anh 6 - Tập 1',
        'unitRange': 'Unit 1 - Unit 6 • Học kỳ I',
        'imagePath': 'assets/images/BiaSGK6_1.jpg',
        'accentColor': _primaryBlue,
      },
      {
        'volume': 2,
        'title': 'Tiếng Anh 6 - Tập 2',
        'unitRange': 'Unit 7 - Unit 12 • Học kỳ II',
        'imagePath': 'assets/images/BiaSGK6_2.jpg',
        'accentColor': Color(0xFF0284C7),
      },
    ];

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(0, 20, 0, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 1. Thẻ học tiếp bài đang dở
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsets.all(18),
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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'ĐANG HỌC DỞ • TẬP 1',
                          style: TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const Text(
                        '35% hoàn thành',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Unit 3: My Friends',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Ngoại hình & Tính cách • Thì Hiện tại tiếp diễn',
                    style: TextStyle(fontSize: 12.5, color: Colors.white70),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const UnitDetailScreen(
                              unitNumber: 3,
                              unitTitle: 'Unit 3: My Friends',
                            ),
                          ),
                        );
                      },
                      icon: const Icon(Icons.play_arrow_rounded, size: 20),
                      label: const Text(
                        'Tiếp tục học bài này',
                        style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w900),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: _primaryBlue,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        elevation: 0,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // 2. Kệ sách giáo khoa 3D tương tác kéo qua kéo lại
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Sách giáo khoa Tiếng Anh 6',
                  style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.w900, color: _textPrimary),
                ),
                Row(
                  children: [
                    Icon(Icons.swipe_rounded, size: 15, color: Colors.grey.shade500),
                    const SizedBox(width: 4),
                    Text(
                      'Kéo chọn tập',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.grey.shade500),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          SizedBox(
            height: 365,
            child: PageView.builder(
              controller: _bookPageController,
              itemCount: books.length,
              itemBuilder: (context, index) {
                final book = books[index];
                final double delta = index - _currentPage;
                final double absDelta = delta.abs().clamp(0.0, 1.0);
                final double scale = 1.0 - (absDelta * 0.12);
                final double angleY = delta * 0.38; // Góc nghiêng 3D khi vuốt

                final matrix = Matrix4.identity()
                  ..setEntry(3, 2, 0.0014) // Tạo chiều sâu phối cảnh 3D
                  ..rotateY(angleY)
                  ..scale(scale, scale, 1.0);

                return Transform(
                  alignment: Alignment.center,
                  transform: matrix,
                  child: _build3DBookItem(
                    volume: book['volume'] as int,
                    title: book['title'] as String,
                    unitRange: book['unitRange'] as String,
                    imagePath: book['imagePath'] as String,
                    accentColor: book['accentColor'] as Color,
                    isFocused: absDelta < 0.35,
                    onTap: () {
                      if (absDelta < 0.35) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => SgkBookReaderScreen(
                              volume: book['volume'] as int,
                              initialPage: 0,
                            ),
                          ),
                        );
                      } else {
                        _bookPageController.animateToPage(
                          index,
                          duration: const Duration(milliseconds: 350),
                          curve: Curves.easeOutCubic,
                        );
                      }
                    },
                  ),
                );
              },
            ),
          ),

          // Dấu chấm chỉ báo trang sách đang chọn
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(books.length, (i) {
              final isSelected = (_currentPage.round() == i);
              return AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                margin: const EdgeInsets.symmetric(horizontal: 4),
                width: isSelected ? 22 : 8,
                height: 8,
                decoration: BoxDecoration(
                  color: isSelected ? _primaryBlue : const Color(0xFFCBD5E1),
                  borderRadius: BorderRadius.circular(6),
                ),
              );
            }),
          ),
          const SizedBox(height: 24),

          // 3. Góc học tập
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Góc học tập của em',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: _textPrimary),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _buildMiniStatCard(
                        icon: Icons.style_rounded,
                        color: const Color(0xFF1D54E8),
                        bgColor: const Color(0xFFEFF6FF),
                        value: '45 từ',
                        label: 'Từ vựng đã thuộc',
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildMiniStatCard(
                        icon: Icons.check_circle_rounded,
                        color: const Color(0xFF059669),
                        bgColor: const Color(0xFFECFDF5),
                        value: '8.5 đ',
                        label: 'Điểm kiểm tra TB',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _build3DBookItem({
    required int volume,
    required String title,
    required String unitRange,
    required String imagePath,
    required Color accentColor,
    required bool isFocused,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Column(
          children: [
            // Giữ đúng tỷ lệ khổ sách SGK (0.72) để ảnh không bao giờ bị méo hay cắt mất chữ
            Expanded(
              child: Center(
                child: AspectRatio(
                  aspectRatio: 0.72,
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(6),
                        bottomLeft: Radius.circular(6),
                        topRight: Radius.circular(16),
                        bottomRight: Radius.circular(16),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: isFocused
                              ? accentColor.withValues(alpha: 0.28)
                              : Colors.black.withValues(alpha: 0.12),
                          blurRadius: isFocused ? 20 : 10,
                          offset: const Offset(6, 10),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        // Lớp mép trang giấy dày ở cạnh phải
                        Positioned(
                          top: 4,
                          bottom: 4,
                          right: 0,
                          left: 10,
                          child: Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFFF1F5F9),
                              borderRadius: const BorderRadius.only(
                                topRight: Radius.circular(14),
                                bottomRight: Radius.circular(14),
                              ),
                              border: Border.all(color: const Color(0xFFCBD5E1), width: 1),
                            ),
                          ),
                        ),

                        // Lớp ảnh bìa sách chính
                        Positioned(
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 6,
                          child: ClipRRect(
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(6),
                              bottomLeft: Radius.circular(6),
                              topRight: Radius.circular(14),
                              bottomRight: Radius.circular(14),
                            ),
                            child: Stack(
                              fit: StackFit.expand,
                              children: [
                                Image.asset(
                                  imagePath,
                                  fit: BoxFit.fill,
                                ),
                                // Rãnh gáy sách 3D bên mép trái
                                Positioned(
                                  top: 0,
                                  bottom: 0,
                                  left: 0,
                                  width: 14,
                                  child: Container(
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [
                                          Colors.black.withValues(alpha: 0.35),
                                          Colors.white.withValues(alpha: 0.25),
                                          Colors.transparent,
                                        ],
                                        stops: const [0.0, 0.45, 1.0],
                                      ),
                                    ),
                                  ),
                                ),
                                // Nhãn Tập 1 / Tập 2 góc trên phải
                                Positioned(
                                  top: 10,
                                  right: 10,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: accentColor,
                                      borderRadius: BorderRadius.circular(8),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withValues(alpha: 0.2),
                                          blurRadius: 4,
                                        ),
                                      ],
                                    ),
                                    child: Text(
                                      'TẬP $volume',
                                      style: const TextStyle(
                                        fontSize: 10.5,
                                        fontWeight: FontWeight.w900,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Tên sách & tiến độ bên dưới
            Text(
              title,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w900,
                color: _textPrimary,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              '$unitRange',
              style: const TextStyle(fontSize: 11.5, color: _textSecondary, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniStatCard({
    required IconData icon,
    required Color color,
    required Color bgColor,
    required String value,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: _textPrimary),
                ),
                const SizedBox(height: 2),
                Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 11, color: _textSecondary, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}