import 'package:flutter/material.dart';
import '../widgets/unit_card_widget.dart';
import 'lesson/unit_detail_screen.dart';
import 'sgk_book_reader_screen.dart';

class StudentSgkScreen extends StatefulWidget {
  final int selectedVolume; // 1 hoặc 2
  final ValueChanged<int> onVolumeChanged;

  const StudentSgkScreen({
    super.key,
    required this.selectedVolume,
    required this.onVolumeChanged,
  });

  @override
  State<StudentSgkScreen> createState() => _StudentSgkScreenState();
}

class _StudentSgkScreenState extends State<StudentSgkScreen> {
  // Bảng màu Tập 1 (Xanh dương bìa Tập 1)
  static const Color _vol1Primary = Color(0xFF1D54E8);
  static const Color _vol1GradientEnd = Color(0xFF02A9D8);

  // Bảng màu Tập 2 (Sắc tím đồng bộ bìa sách Tập 2)
  static const Color _vol2Primary = Color(0xFF7E22CE);
  static const Color _vol2GradientEnd = Color(0xFFC048E8);

  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  late final PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: widget.selectedVolume - 1);
  }

  @override
  void didUpdateWidget(covariant StudentSgkScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedVolume != widget.selectedVolume && _pageController.hasClients) {
      final targetPage = widget.selectedVolume - 1;
      if (_pageController.page?.round() != targetPage) {
        _pageController.animateToPage(
          targetPage,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOutCubic,
        );
      }
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const volume1Items = [
      {'type': 'unit', 'num': 1, 'title': 'Unit 1: My New School', 'page': 'Trang 6 - 15', 'progress': 1.0},
      {'type': 'unit', 'num': 2, 'title': 'Unit 2: My House', 'page': 'Trang 16 - 25', 'progress': 0.75},
      {'type': 'unit', 'num': 3, 'title': 'Unit 3: My Friends', 'page': 'Trang 26 - 35', 'progress': 0.35},
      {
        'type': 'review',
        'num': 101,
        'title': 'Review 1: Tổng ôn & Kiểm tra lộ trình',
        'page': 'Trang 36 - 37 • Yêu cầu hoàn thành Unit 1 - 3',
        'unlocked': false,
      },
      {'type': 'unit', 'num': 4, 'title': 'Unit 4: My Neighbourhood', 'page': 'Trang 38 - 47', 'progress': 0.0},
      {'type': 'unit', 'num': 5, 'title': 'Unit 5: Natural Wonders of Viet Nam', 'page': 'Trang 48 - 57', 'progress': 0.0},
      {'type': 'unit', 'num': 6, 'title': 'Unit 6: Our Tet Holiday', 'page': 'Trang 58 - 67', 'progress': 0.0},
      {
        'type': 'review',
        'num': 102,
        'title': 'Review 2: Tổng ôn & Cập nhật lộ trình',
        'page': 'Trang 68 - 69 • Yêu cầu hoàn thành Unit 4 - 6',
        'unlocked': false,
      },
    ];

    const volume2Items = [
      {'type': 'unit', 'num': 7, 'title': 'Unit 7: Television', 'page': 'Trang 6 - 15', 'progress': 0.0},
      {'type': 'unit', 'num': 8, 'title': 'Unit 8: Sports and Games', 'page': 'Trang 16 - 25', 'progress': 0.0},
      {'type': 'unit', 'num': 9, 'title': 'Unit 9: Cities of the World', 'page': 'Trang 26 - 35', 'progress': 0.0},
      {
        'type': 'review',
        'num': 103,
        'title': 'Review 3: Tổng ôn & Kiểm tra lộ trình',
        'page': 'Trang 36 - 37 • Yêu cầu hoàn thành Unit 7 - 9',
        'unlocked': false,
      },
      {'type': 'unit', 'num': 10, 'title': 'Unit 10: Our Houses in the Future', 'page': 'Trang 38 - 47', 'progress': 0.0},
      {'type': 'unit', 'num': 11, 'title': 'Unit 11: Our Greener World', 'page': 'Trang 48 - 57', 'progress': 0.0},
      {'type': 'unit', 'num': 12, 'title': 'Unit 12: Robots', 'page': 'Trang 58 - 67', 'progress': 0.0},
      {
        'type': 'review',
        'num': 104,
        'title': 'Review 4: Tổng ôn & Đánh giá cuối năm',
        'page': 'Trang 68 - 69 • Yêu cầu hoàn thành Unit 10 - 12',
        'unlocked': false,
      },
    ];

    return PageView(
      controller: _pageController,
      onPageChanged: (pageIndex) {
        widget.onVolumeChanged(pageIndex + 1);
      },
      children: [
        _buildVolumePage(
          context: context,
          volume: 1,
          title: 'Tiếng Anh 6 - Tập 1',
          coverImage: 'assets/images/BiaSGK6_1.jpg',
          items: volume1Items,
          accentColor: _vol1Primary,
          gradientEndColor: _vol1GradientEnd,
        ),
        _buildVolumePage(
          context: context,
          volume: 2,
          title: 'Tiếng Anh 6 - Tập 2',
          coverImage: 'assets/images/BiaSGK6_2.jpg',
          items: volume2Items,
          accentColor: _vol2Primary,
          gradientEndColor: _vol2GradientEnd,
        ),
      ],
    );
  }

  Widget _buildReviewCard({
    required BuildContext context,
    required int reviewNum,
    required String title,
    required String subtitle,
    required bool isUnlocked,
    required Color accentColor,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: isUnlocked ? accentColor.withValues(alpha: 0.06) : const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isUnlocked ? accentColor.withValues(alpha: 0.45) : const Color(0xFFE2E8F0),
          width: isUnlocked ? 1.4 : 1.0,
        ),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: () {
          if (!isUnlocked) {
            ScaffoldMessenger.of(context).hideCurrentSnackBar();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text(
                  'Em cần hoàn thành đủ 3 Unit phía trên để mở khóa bài Review & Kiểm tra lộ trình!',
                  style: TextStyle(fontWeight: FontWeight.w700),
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
                unitNumber: reviewNum,
                unitTitle: title,
              ),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: isUnlocked ? accentColor : const Color(0xFFE2E8F0),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  isUnlocked ? Icons.assignment_turned_in_rounded : Icons.lock_rounded,
                  color: isUnlocked ? Colors.white : const Color(0xFF64748B),
                  size: 22,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 14.5,
                        fontWeight: FontWeight.w900,
                        color: isUnlocked ? _textPrimary : _textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isUnlocked ? accentColor : _textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                isUnlocked ? Icons.chevron_right_rounded : Icons.lock_outline_rounded,
                color: isUnlocked ? accentColor : _textSecondary,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildVolumePage({
    required BuildContext context,
    required int volume,
    required String title,
    required String coverImage,
    required List items,
    required Color accentColor,
    required Color gradientEndColor,
  }) {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 115),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => SgkBookReaderScreen(
                    volume: volume,
                    initialPage: 0,
                  ),
                ),
              );
            },
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: accentColor.withValues(alpha: 0.25)),
                boxShadow: [
                  BoxShadow(
                    color: accentColor.withValues(alpha: 0.08),
                    blurRadius: 14,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  SizedBox(
                    width: 66,
                    child: AspectRatio(
                      aspectRatio: 0.72,
                      child: Stack(
                        children: [
                          Positioned(
                            top: 3,
                            bottom: 3,
                            right: 0,
                            left: 6,
                            child: Container(
                              decoration: BoxDecoration(
                                color: const Color(0xFFF1F5F9),
                                borderRadius: const BorderRadius.only(
                                  topRight: Radius.circular(8),
                                  bottomRight: Radius.circular(8),
                                ),
                                border: Border.all(color: const Color(0xFFCBD5E1)),
                              ),
                            ),
                          ),
                          Positioned(
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 4,
                            child: ClipRRect(
                              borderRadius: const BorderRadius.only(
                                topLeft: Radius.circular(4),
                                bottomLeft: Radius.circular(4),
                                topRight: Radius.circular(8),
                                bottomRight: Radius.circular(8),
                              ),
                              child: Image.asset(
                                coverImage,
                                fit: BoxFit.fill,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(fontSize: 16.5, fontWeight: FontWeight.w900, color: _textPrimary),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Icon(Icons.auto_stories_rounded, size: 15, color: accentColor),
                            const SizedBox(width: 6),
                            Text(
                              'Chạm để mở đọc toàn bộ sách',
                              style: TextStyle(
                                fontSize: 12.5,
                                fontWeight: FontWeight.w700,
                                color: accentColor,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Icon(Icons.chevron_right_rounded, color: accentColor),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          Text(
            'Danh sách bài học Tập $volume (6 Unit & 2 Review)',
            style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.w900, color: _textPrimary),
          ),
          const SizedBox(height: 12),

          for (int i = 0; i < items.length; i++) ...[
            Builder(
              builder: (_) {
                final item = items[i] as Map;
                final isReview = item['type'] == 'review';

                if (isReview) {
                  return _buildReviewCard(
                    context: context,
                    reviewNum: item['num'] as int,
                    title: item['title'].toString(),
                    subtitle: item['page'].toString(),
                    isUnlocked: item['unlocked'] == true,
                    accentColor: accentColor,
                  );
                }

                final unitNum = item['num'] as int;
                final unitTitle = item['title'].toString();
                return UnitCardWidget(
                  unitNumber: unitNum,
                  title: unitTitle,
                  subtitle: item['page'].toString(),
                  progress: item['progress'] as double,
                  accentColor: accentColor,
                  gradientEndColor: gradientEndColor,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => UnitDetailScreen(
                          unitNumber: unitNum,
                          unitTitle: unitTitle,
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ],
      ),
    );
  }
}