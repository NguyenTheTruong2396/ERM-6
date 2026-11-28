import 'package:flutter/material.dart';
import 'lesson/unit_detail_screen.dart';

class SgkBookReaderScreen extends StatefulWidget {
  final int volume; // 1 hoặc 2
  final int initialPage;

  const SgkBookReaderScreen({
    super.key,
    required this.volume,
    this.initialPage = 0,
  });

  @override
  State<SgkBookReaderScreen> createState() => _SgkBookReaderScreenState();
}

class _SgkBookReaderScreenState extends State<SgkBookReaderScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);

  late final PageController _pageController;
  late int _currentPage;

  // Tiến độ giả lập hiện tại của các Unit (1.0 = đã hoàn thành)
  // Sau này nối API/CSDL sẽ truyền tiến độ thật của học sinh vào đây
  final Map<int, double> _unitProgress = const {
    1: 1.0,
    2: 0.75,
    3: 0.35,
    4: 0.0,
    5: 0.0,
    6: 0.0,
  };

  @override
  void initState() {
    super.initState();
    _currentPage = widget.initialPage;
    _pageController = PageController(initialPage: widget.initialPage);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  bool _isReview1Unlocked() {
    return (_unitProgress[1] ?? 0) >= 1.0 &&
        (_unitProgress[2] ?? 0) >= 1.0 &&
        (_unitProgress[3] ?? 0) >= 1.0;
  }

  bool _isReview2Unlocked() {
    return (_unitProgress[4] ?? 0) >= 1.0 &&
        (_unitProgress[5] ?? 0) >= 1.0 &&
        (_unitProgress[6] ?? 0) >= 1.0;
  }

  /// Xác định Unit hoặc Review theo số trang sách Tập 1
  Map<String, dynamic>? _getLessonForPage(int page) {
    if (widget.volume == 1) {
      if (page >= 6 && page <= 15) {
        return {
          'unitNumber': 1,
          'title': 'Unit 1: My New School',
          'pageRange': 'Trang 6 - 15',
          'isReview': false,
          'isUnlocked': true,
        };
      }
      if (page >= 16 && page <= 25) {
        return {
          'unitNumber': 2,
          'title': 'Unit 2: My House',
          'pageRange': 'Trang 16 - 25',
          'isReview': false,
          'isUnlocked': true,
        };
      }
      if (page >= 26 && page <= 35) {
        return {
          'unitNumber': 3,
          'title': 'Unit 3: My Friends',
          'pageRange': 'Trang 26 - 35',
          'isReview': false,
          'isUnlocked': true,
        };
      }
      if (page == 36 || page == 37) {
        final unlocked = _isReview1Unlocked();
        return {
          'unitNumber': 101, // Mã bài Review 1
          'title': 'Review 1 (Units 1 - 2 - 3)',
          'pageRange': 'Trang 36 - 37',
          'isReview': true,
          'isUnlocked': unlocked,
          'lockHint': 'Hoàn thành đủ Unit 1, 2, 3 để mở khóa & kiểm tra lộ trình',
        };
      }
      if (page >= 38 && page <= 47) {
        return {
          'unitNumber': 4,
          'title': 'Unit 4: My Neighbourhood',
          'pageRange': 'Trang 38 - 47',
          'isReview': false,
          'isUnlocked': true,
        };
      }
      if (page >= 48 && page <= 57) {
        return {
          'unitNumber': 5,
          'title': 'Unit 5: Natural Wonders of Viet Nam',
          'pageRange': 'Trang 48 - 57',
          'isReview': false,
          'isUnlocked': true,
        };
      }
      if (page >= 58 && page <= 67) {
        return {
          'unitNumber': 6,
          'title': 'Unit 6: Our Tet Holiday',
          'pageRange': 'Trang 58 - 67',
          'isReview': false,
          'isUnlocked': true,
        };
      }
      if (page == 68 || page == 69) {
        final unlocked = _isReview2Unlocked();
        return {
          'unitNumber': 102, // Mã bài Review 2
          'title': 'Review 2 (Units 4 - 5 - 6)',
          'pageRange': 'Trang 68 - 69',
          'isReview': true,
          'isUnlocked': unlocked,
          'lockHint': 'Hoàn thành đủ Unit 4, 5, 6 để mở khóa & cập nhật lộ trình',
        };
      }
    }
    return null;
  }

  void _handleLessonTap(Map<String, dynamic> info) {
    final bool isUnlocked = info['isUnlocked'] == true;
    if (!isUnlocked) {
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            info['lockHint']?.toString() ?? 'Em cần hoàn thành 3 Unit trước đó để mở bài Review này!',
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
          backgroundColor: const Color(0xFF334155),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
      return;
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => UnitDetailScreen(
          unitNumber: info['unitNumber'] as int,
          unitTitle: info['title'].toString(),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final int totalPages = widget.volume == 1 ? 72 : 1;
    final lessonInfo = _getLessonForPage(_currentPage);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        elevation: 0,
        automaticallyImplyLeading: false,
        titleSpacing: 20,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Tiếng Anh 6 - Tập ${widget.volume}',
              style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.w900),
            ),
            Text(
              _currentPage == 0
                  ? 'Bìa sách • Vuốt ngang để lật trang'
                  : 'Trang $_currentPage / ${totalPages - 1}',
              style: const TextStyle(fontSize: 11.5, color: Colors.white70),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 8, top: 11, bottom: 11),
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.14),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                _currentPage == 0 ? 'Bìa' : 'Tr. $_currentPage',
                style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 14),
            child: IconButton(
              tooltip: 'Đóng sách',
              style: IconButton.styleFrom(
                backgroundColor: Colors.white.withValues(alpha: 0.18),
                foregroundColor: Colors.white,
              ),
              icon: const Icon(Icons.close_rounded, size: 22),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          // 1. Trang sách cố định 100% kích thước & vị trí trên mọi trang
          Positioned.fill(
            child: PageView.builder(
              controller: _pageController,
              physics: const BouncingScrollPhysics(),
              itemCount: totalPages,
              onPageChanged: (index) {
                setState(() => _currentPage = index);
              },
              itemBuilder: (context, index) {
                final imagePath = widget.volume == 1
                    ? 'assets/images/sgk1/SGK6_$index.jpg'
                    : 'assets/images/BiaSGK6_2.jpg';

                return Padding(
                  padding: const EdgeInsets.fromLTRB(14, 8, 14, 96),
                  child: Center(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(14),
                      child: Image.asset(
                        imagePath,
                        fit: BoxFit.contain,
                        errorBuilder: (_, __, ___) => Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.menu_book_rounded, color: Colors.white54, size: 48),
                              const SizedBox(height: 12),
                              Text(
                                'Trang $index (Tập ${widget.volume})',
                                style: const TextStyle(color: Colors.white70, fontWeight: FontWeight.w700),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // 2. Thanh điều hướng bài học / Review (có trạng thái khóa nếu chưa xong 3 Unit)
          Positioned(
            left: 16,
            right: 16,
            bottom: 14,
            child: SafeArea(
              top: false,
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 220),
                child: lessonInfo != null
                    ? GestureDetector(
                  key: ValueKey('${lessonInfo['unitNumber']}_${lessonInfo['isUnlocked']}'),
                  onTap: () => _handleLessonTap(lessonInfo),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
                    decoration: BoxDecoration(
                      gradient: lessonInfo['isUnlocked'] == true
                          ? LinearGradient(
                        colors: lessonInfo['isReview'] == true
                            ? const [Color(0xFF7C3AED), Color(0xFF4F46E5)]
                            : const [_primaryBlue, _gradientCyan],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      )
                          : const LinearGradient(
                        colors: [Color(0xFF334155), Color(0xFF475569)],
                      ),
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.35),
                          blurRadius: 14,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Icon(
                          lessonInfo['isUnlocked'] == true
                              ? (lessonInfo['isReview'] == true
                              ? Icons.assignment_turned_in_rounded
                              : Icons.auto_stories_rounded)
                              : Icons.lock_rounded,
                          color: Colors.white,
                          size: 22,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                '${lessonInfo['title']} (${lessonInfo['pageRange']})',
                                style: const TextStyle(
                                  fontSize: 13.5,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                lessonInfo['isUnlocked'] == true
                                    ? (lessonInfo['isReview'] == true
                                    ? 'Bấm vào để ôn tập & làm bài kiểm tra lộ trình'
                                    : 'Bấm vào để học Unit ${lessonInfo['unitNumber']}')
                                    : lessonInfo['lockHint'].toString(),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white70,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Icon(
                          lessonInfo['isUnlocked'] == true
                              ? Icons.arrow_forward_ios_rounded
                              : Icons.lock_outline_rounded,
                          color: Colors.white,
                          size: 16,
                        ),
                      ],
                    ),
                  ),
                )
                    : const SizedBox.shrink(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}