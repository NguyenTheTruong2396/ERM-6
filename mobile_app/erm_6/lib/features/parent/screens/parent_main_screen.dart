import 'package:flutter/material.dart';
import '../widgets/child_selector_sheet.dart';
import 'child_progress_screen.dart';
import 'parent_dashboard_screen.dart';
import 'parent_notifications_screen.dart';
import 'parent_profile_screen.dart';

class ParentMainScreen extends StatefulWidget {
  final String phoneNumber;

  const ParentMainScreen({
    super.key,
    this.phoneNumber = '',
  });

  @override
  State<ParentMainScreen> createState() => _ParentMainScreenState();
}

class _ParentMainScreenState extends State<ParentMainScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);

  int _currentIndex = 0;
  int _selectedChildIndex = 0;

  final List _childrenList = const [
    ChildInfo(
      id: 'HS01',
      name: 'Nguyễn Minh Anh',
      className: 'Lớp 6A1 • Tiếng Anh 6',
    ),
    ChildInfo(
      id: 'HS02',
      name: 'Nguyễn Gia Bảo',
      className: 'Lớp 6A4 • Tiếng Anh 6',
    ),
  ];

  void _openChildSwitcher() {
    showChildSelectorSheet(
      context: context,
      children: _childrenList,
      selectedIndex: _selectedChildIndex,
      onSelect: (newIndex) {
        setState(() {
          _selectedChildIndex = newIndex as int;
        });
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final activeChild = _childrenList[_selectedChildIndex] as ChildInfo;

    final pages = [
      ParentDashboardScreen(
        activeChild: activeChild,
        totalChildren: _childrenList.length,
        onSwitchChild: _openChildSwitcher,
      ),
      const ChildProgressScreen(),
      ParentProfileScreen(
        phoneNumber: widget.phoneNumber,
        childrenList: _childrenList,
        selectedChildIndex: _selectedChildIndex,
        onSelectChild: (index) {
          setState(() => _selectedChildIndex = index as int);
        },
      ),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [_primaryBlue, _gradientCyan],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.family_restroom_rounded, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Cổng Phụ huynh ERM-6',
                    style: TextStyle(
                      fontSize: 15.5,
                      fontWeight: FontWeight.w900,
                      color: _textPrimary,
                    ),
                  ),
                  Text(
                    'Đang xem: ${activeChild.name}',
                    style: const TextStyle(fontSize: 11.5, color: _primaryBlue, fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: _textPrimary),
            tooltip: 'Thông báo tức thì',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ParentNotificationsScreen()),
              );
            },
          ),
          const SizedBox(width: 6),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          backgroundColor: Colors.white,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: _primaryBlue,
          unselectedItemColor: const Color(0xFF94A3B8),
          selectedLabelStyle: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800),
          unselectedLabelStyle: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600),
          elevation: 0,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined),
              activeIcon: Icon(Icons.dashboard_rounded),
              label: 'Tổng quan',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.route_outlined),
              activeIcon: Icon(Icons.route_rounded),
              label: 'Lộ trình',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline_rounded),
              activeIcon: Icon(Icons.person_rounded),
              label: 'Tài khoản',
            ),
          ],
        ),
      ),
    );
  }
}