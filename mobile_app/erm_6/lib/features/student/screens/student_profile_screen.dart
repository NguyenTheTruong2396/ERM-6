import 'package:flutter/material.dart';
import 'student_account_detail_screen.dart';

class StudentProfileScreen extends StatelessWidget {
  final String studentName;
  final bool isSchoolStudent;
  final String? avatarUrl;

  const StudentProfileScreen({
    super.key,
    this.studentName = 'Nguyễn Văn A',
    this.isSchoolStudent = true,
    this.avatarUrl,
  });

  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  final String _studentCode = 'HS2026-0614';
  final String _email = 'nguyenvana.6a1@gmail.com';
  final String _className = 'Lớp 6A1';
  final String _parentName = 'Nguyễn Văn Hùng';

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 115),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Thẻ hồ sơ bên ngoài
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                Container(
                  width: 68,
                  height: 68,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [_primaryBlue, _gradientCyan],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: ClipOval(
                    child: avatarUrl != null && avatarUrl!.isNotEmpty
                        ? Image.network(avatarUrl!, fit: BoxFit.cover)
                        : const Icon(Icons.person_rounded, color: Colors.white, size: 36),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  studentName,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: _textPrimary,
                  ),
                ),
                const SizedBox(height: 10),

                // Nút viên thuốc mở trang trong
                InkWell(
                  borderRadius: BorderRadius.circular(20),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => StudentAccountDetailScreen(
                          studentName: studentName,
                          email: _email,
                          isSchoolStudent: isSchoolStudent,
                          avatarUrl: avatarUrl,
                        ),
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE0F2FE),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Xem thông tin & Cài đặt tài khoản',
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w800,
                            color: _primaryBlue,
                          ),
                        ),
                        SizedBox(width: 4),
                        Icon(Icons.arrow_forward_ios_rounded, size: 12, color: _primaryBlue),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Khung 4 thông tin cơ bản bên ngoài: Mã học sinh, Gmail, Lớp, Phụ huynh
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    children: [
                      _buildBasicInfoRow(Icons.badge_outlined, 'Mã học sinh', _studentCode),
                      const Divider(height: 16, color: Color(0xFFE2E8F0)),
                      _buildBasicInfoRow(Icons.email_outlined, 'Gmail', _email),
                      if (isSchoolStudent) ...[
                        const Divider(height: 16, color: Color(0xFFE2E8F0)),
                        _buildBasicInfoRow(Icons.class_outlined, 'Lớp', _className),
                        const Divider(height: 16, color: Color(0xFFE2E8F0)),
                        _buildBasicInfoRow(Icons.family_restroom_outlined, 'Phụ huynh', _parentName),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Thống kê học tập
          Row(
            children: [
              Expanded(child: _buildStatCard('Unit hoàn thành', '2 / 12', Icons.check_circle_rounded, const Color(0xFF047857))),
              const SizedBox(width: 12),
              Expanded(child: _buildStatCard('Điểm trung bình', '8.5', Icons.star_rounded, const Color(0xFFD97706))),
            ],
          ),
          const SizedBox(height: 20),

          // Nút đăng xuất
          OutlinedButton.icon(
            onPressed: () {
              Navigator.of(context).popUntil((route) => route.isFirst);
            },
            icon: const Icon(Icons.logout_rounded, size: 19, color: Color(0xFFDC2626)),
            label: const Text(
              'Đăng xuất tài khoản',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: Color(0xFFDC2626),
              ),
            ),
            style: OutlinedButton.styleFrom(
              backgroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              side: const BorderSide(color: Color(0xFFFECACA)),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBasicInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 17, color: _primaryBlue),
        const SizedBox(width: 8),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12.5,
            fontWeight: FontWeight.w600,
            color: _textSecondary,
          ),
        ),
        const Spacer(),
        Text(
          value,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: _textPrimary,
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: _textPrimary),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: _textSecondary),
          ),
        ],
      ),
    );
  }
}