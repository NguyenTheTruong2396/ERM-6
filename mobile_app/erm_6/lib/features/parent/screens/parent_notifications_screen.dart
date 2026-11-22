import 'package:flutter/material.dart';
import '../widgets/notification_card_widget.dart';

class ParentNotificationsScreen extends StatefulWidget {
  const ParentNotificationsScreen({super.key});

  @override
  State<ParentNotificationsScreen> createState() => _ParentNotificationsScreenState();
}

class _ParentNotificationsScreenState extends State<ParentNotificationsScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  int _selectedFilter = 0; // 0: Tất cả, 1: Chưa đọc

  final List _allNotifications = const [
    {
      'title': 'Kiểm tra 15 phút • Unit 1: My New School',
      'score': '9.0 / 10',
      'duration': '12 phút 30 giây',
      'rank': 'Giỏi',
      'submittedAt': 'Hôm nay • 19:45',
      'isUnread': true,
    },
    {
      'title': 'Bài luyện tập tổng hợp • Unit 2: My House',
      'score': '8.0 / 10',
      'duration': '18 phút 10 giây',
      'rank': 'Khá',
      'submittedAt': 'Hôm qua • 20:15',
      'isUnread': false,
    },
    {
      'title': 'Kiểm tra từ vựng & phát âm • Unit 3: My Friends',
      'score': '9.5 / 10',
      'duration': '09 phút 50 giây',
      'rank': 'Xuất sắc',
      'submittedAt': '15/11/2026 • 18:20',
      'isUnread': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final displayedList = _selectedFilter == 0
        ? _allNotifications
        : _allNotifications.where((e) => e['isUnread'] == true).toList();

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
          'Thông báo nộp bài',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: _textPrimary),
        ),
        actions: [
          TextButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Đã đánh dấu tất cả là đã đọc')),
              );
            },
            child: const Text(
              'Đọc tất cả',
              style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: _primaryBlue),
            ),
          ),
          const SizedBox(width: 6),
        ],
      ),
      body: Column(
        children: [
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 14),
            child: Row(
              children: [
                _buildFilterChip(label: 'Tất cả (${_allNotifications.length})', index: 0),
                const SizedBox(width: 10),
                _buildFilterChip(label: 'Chưa đọc (1)', index: 1),
              ],
            ),
          ),
          const Divider(height: 1, color: Color(0xFFE2E8F0)),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(20),
              itemCount: displayedList.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final item = displayedList[index];
                return ParentNotificationCard(
                  title: item['title'],
                  score: item['score'],
                  duration: item['duration'],
                  rank: item['rank'],
                  submittedAt: item['submittedAt'],
                  isUnread: item['isUnread'],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip({required String label, required int index}) {
    final isSelected = _selectedFilter == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedFilter = index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? _primaryBlue : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12.5,
            fontWeight: FontWeight.w800,
            color: isSelected ? Colors.white : _textSecondary,
          ),
        ),
      ),
    );
  }
}