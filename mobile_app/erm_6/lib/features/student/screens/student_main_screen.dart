import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'student_home_screen.dart';
import 'student_sgk_screen.dart';
import 'student_roadmap_screen.dart';
import 'student_profile_screen.dart';

class StudentMainScreen extends StatefulWidget {
  final String studentName;
  final bool isSchoolStudent;

  const StudentMainScreen({
    super.key,
    this.studentName = 'Nguyễn Văn A',
    this.isSchoolStudent = true,
  });

  @override
  State<StudentMainScreen> createState() => _StudentMainScreenState();
}

class _StudentMainScreenState extends State<StudentMainScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);

  int _currentIndex = 0;
  int _selectedVolume = 1; // 1 = Tập 1, 2 = Tập 2

  void _handleVolumeChanged(int vol) {
    if (_selectedVolume != vol) {
      setState(() => _selectedVolume = vol);
    }
  }

  void _openSgkVolume(int vol) {
    setState(() {
      _selectedVolume = vol;
      _currentIndex = 1;
    });
  }

  /// Header xanh dương tràn viền chỉ hiển thị đúng tên trang (SGK, Lộ trình cá nhân, Cá nhân)
  Widget _buildBluePageHeader(String title, {Widget? bottomChild}) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF1A68E8), Color(0xFF1E88E5)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: Padding(
            padding: EdgeInsets.fromLTRB(20, 12, 20, bottomChild != null ? 14 : 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 0.2,
                  ),
                ),
                if (bottomChild != null) ...[
                  const SizedBox(height: 12),
                  bottomChild,
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      StudentHomeScreen(
        studentName: widget.studentName,
        isSchoolStudent: widget.isSchoolStudent,
        onSelectVolume: _openSgkVolume,
      ),
      StudentSgkScreen(
        selectedVolume: _selectedVolume,
        onVolumeChanged: _handleVolumeChanged,
      ),
      const StudentRoadmapScreen(),
      StudentProfileScreen(
        studentName: widget.studentName,
        isSchoolStudent: widget.isSchoolStudent,
      ),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      extendBody: true,
      appBar: _currentIndex == 0
          ? AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        automaticallyImplyLeading: false,
        titleSpacing: 20,
        title: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [_primaryBlue, _gradientCyan],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.school_rounded, color: Colors.white, size: 22),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Tiếng Anh 6 • ERM-6',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: _textPrimary),
                ),
                Text(
                  'Xin chào, ${widget.studentName}',
                  style: const TextStyle(fontSize: 12, color: _primaryBlue, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ],
        ),
      )
          : null,
      body: Column(
        children: [
          if (_currentIndex == 1)
            _buildBluePageHeader(
              'Sách giáo khoa',
              bottomChild: Row(
                children: [
                  Expanded(
                    child: _buildVolumePillTab(
                      label: 'Tập 1',
                      isActive: _selectedVolume == 1,
                      onTap: () => _handleVolumeChanged(1),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildVolumePillTab(
                      label: 'Tập 2',
                      isActive: _selectedVolume == 2,
                      onTap: () => _handleVolumeChanged(2),
                    ),
                  ),
                ],
              ),
            ),
          if (_currentIndex == 2) _buildBluePageHeader('Lộ trình cá nhân'),
          if (_currentIndex == 3) _buildBluePageHeader('Cá nhân'),

          Expanded(
            child: IndexedStack(
              index: _currentIndex,
              children: pages,
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 14),
          child: Container(
            height: 64,
            padding: const EdgeInsets.symmetric(horizontal: 10),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1D6CE8), Color(0xFF1982EC)],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ),
              borderRadius: BorderRadius.circular(36),
              boxShadow: [
                BoxShadow(
                  color: _primaryBlue.withValues(alpha: 0.28),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildNavItem(index: 0, icon: Icons.home_outlined, activeIcon: Icons.home_rounded, label: 'Trang chủ'),
                _buildNavItem(index: 1, icon: Icons.menu_book_outlined, activeIcon: Icons.menu_book_rounded, label: 'SGK'),
                _buildNavItem(index: 2, icon: Icons.route_outlined, activeIcon: Icons.route_rounded, label: 'Lộ trình'),
                _buildNavItem(index: 3, icon: Icons.person_outline_rounded, activeIcon: Icons.person_rounded, label: 'Cá nhân'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildVolumePillTab({
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: isActive ? Colors.white : Colors.white.withValues(alpha: 0.14),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.menu_book_rounded,
              size: 16,
              color: isActive ? const Color(0xFF1A68E8) : Colors.white.withValues(alpha: 0.85),
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: isActive ? const Color(0xFF1A68E8) : Colors.white.withValues(alpha: 0.9),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required IconData icon,
    required IconData activeIcon,
    required String label,
  }) {
    final bool isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 240),
        curve: Curves.easeOutCubic,
        padding: EdgeInsets.symmetric(horizontal: isSelected ? 16 : 14, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white.withValues(alpha: 0.22) : Colors.transparent,
          borderRadius: BorderRadius.circular(26),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(isSelected ? activeIcon : icon, color: Colors.white, size: 22),
            if (isSelected) ...[
              const SizedBox(width: 8),
              Text(
                label,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 13),
              ),
            ],
          ],
        ),
      ),
    );
  }
}