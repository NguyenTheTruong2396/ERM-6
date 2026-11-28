import 'package:flutter/material.dart';
import '../../auth/screens/role_selection_screen.dart';
import '../widgets/child_selector_sheet.dart';
import 'parent_edit_profile_screen.dart';

class ParentProfileScreen extends StatefulWidget {
  final String phoneNumber;
  final List childrenList;
  final int selectedChildIndex;
  final ValueChanged onSelectChild;

  const ParentProfileScreen({
    super.key,
    this.phoneNumber = '',
    required this.childrenList,
    required this.selectedChildIndex,
    required this.onSelectChild,
  });

  @override
  State<ParentProfileScreen> createState() => _ParentProfileScreenState();
}

class _ParentProfileScreenState extends State<ParentProfileScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  String _fullName = 'Nguyễn Văn An';
  String _email = 'phuhuynh.erm6@gmail.com';
  String _relation = 'Phụ huynh (Bố / Mẹ)';

  Future _openEditProfilePage() async {
    final displayPhone = widget.phoneNumber.isNotEmpty ? widget.phoneNumber : '0901 234 567';

    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ParentEditProfileScreen(
          initialFullName: _fullName,
          initialEmail: _email,
          initialRelation: _relation,
          phoneNumber: displayPhone,
        ),
      ),
    );

    if (result != null && result is Map) {
      setState(() {
        _fullName = result['fullName'] ?? _fullName;
        _email = result['email'] ?? _email;
        _relation = result['relation'] ?? _relation;
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đã cập nhật thông tin cá nhân!')),
      );
    }
  }

  void _handleLogout(BuildContext context) {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const RoleSelectionScreen()),
          (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final displayPhone = widget.phoneNumber.isNotEmpty ? widget.phoneNumber : '0901 234 567';

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 1. Thẻ thông tin cá nhân Phụ huynh + nút mở trang Chỉnh sửa
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: _primaryBlue.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: const Icon(Icons.family_restroom_rounded, color: _primaryBlue, size: 30),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _fullName,
                            style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: _textPrimary),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            _relation,
                            style: const TextStyle(fontSize: 12.5, color: _textSecondary, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      onPressed: _openEditProfilePage,
                      tooltip: 'Chỉnh sửa thông tin',
                      style: IconButton.styleFrom(
                        backgroundColor: _primaryBlue.withValues(alpha: 0.08),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      icon: const Icon(Icons.edit_outlined, color: _primaryBlue, size: 20),
                    ),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 14),
                  child: Divider(height: 1, color: Color(0xFFE2E8F0)),
                ),
                _buildInfoRow(icon: Icons.phone_android_rounded, label: 'Số điện thoại', value: displayPhone),
                const SizedBox(height: 10),
                _buildInfoRow(icon: Icons.email_outlined, label: 'Email liên hệ', value: _email),
              ],
            ),
          ),
          const SizedBox(height: 22),

          // 2. Danh sách các con đã liên kết
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Học sinh liên kết (${widget.childrenList.length})',
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: _textPrimary),
              ),
              const Text(
                'Chạm để chuyển',
                style: TextStyle(fontSize: 12, color: _textSecondary),
              ),
            ],
          ),
          const SizedBox(height: 10),
          for (int i = 0; i < widget.childrenList.length; i++) ...[
            Builder(
              builder: (_) {
                final child = widget.childrenList[i] as ChildInfo;
                final isSelected = i == widget.selectedChildIndex;
                return GestureDetector(
                  onTap: () => widget.onSelectChild(i),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(15),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFF0F7FF) : Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: isSelected ? _primaryBlue : const Color(0xFFE2E8F0),
                        width: isSelected ? 1.5 : 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 42,
                          height: 42,
                          decoration: BoxDecoration(
                            color: isSelected ? _primaryBlue : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(13),
                          ),
                          child: Icon(
                            Icons.school_rounded,
                            color: isSelected ? Colors.white : _textSecondary,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                child.name,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _textPrimary),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${child.className}',
                                style: const TextStyle(fontSize: 12, color: _textSecondary),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: isSelected ? _primaryBlue : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            isSelected ? 'Đang xem' : 'Chọn xem',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: isSelected ? Colors.white : _textSecondary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
          const SizedBox(height: 16),

          // 3. Nút Đăng xuất
          ElevatedButton.icon(
            onPressed: () => _handleLogout(context),
            icon: const Icon(Icons.logout_rounded, size: 18),
            label: const Text(
              'Đăng xuất tài khoản',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFFE4E6),
              foregroundColor: const Color(0xFFBE123C),
              padding: const EdgeInsets.symmetric(vertical: 15),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 0,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Icon(icon, size: 18, color: _textSecondary),
        const SizedBox(width: 10),
        Text(
          '$label:',
          style: const TextStyle(fontSize: 13, color: _textSecondary),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: _textPrimary),
          ),
        ),
      ],
    );
  }
}