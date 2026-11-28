import 'package:flutter/material.dart';

class StudentAccountDetailScreen extends StatefulWidget {
  final String studentName;
  final String email;
  final bool isSchoolStudent;
  final String? avatarUrl;

  const StudentAccountDetailScreen({
    super.key,
    required this.studentName,
    required this.email,
    required this.isSchoolStudent,
    this.avatarUrl,
  });

  @override
  State<StudentAccountDetailScreen> createState() => _StudentAccountDetailScreenState();
}

class _StudentAccountDetailScreenState extends State<StudentAccountDetailScreen> {
  static const Color _primaryBlue = Color(0xFF1D54E8);
  static const Color _gradientCyan = Color(0xFF02A9D8);
  static const Color _textPrimary = Color(0xFF0F172A);
  static const Color _textSecondary = Color(0xFF64748B);

  final _oldPassCtrl = TextEditingController();
  final _newPassCtrl = TextEditingController();
  final _confirmPassCtrl = TextEditingController();
  bool _obscureOld = true;
  bool _obscureNew = true;
  bool _obscureConfirm = true;

  @override
  void dispose() {
    _oldPassCtrl.dispose();
    _newPassCtrl.dispose();
    _confirmPassCtrl.dispose();
    super.dispose();
  }

  void _showPickImageOptions() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (sheetCtx) {
        return Container(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 26),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: SafeArea(
            top: false,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFCBD5E1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Cập nhật ảnh đại diện',
                  style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.w900, color: _textPrimary),
                ),
                const SizedBox(height: 12),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: _primaryBlue.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.photo_library_rounded, color: _primaryBlue),
                  ),
                  title: const Text(
                    'Chọn ảnh từ thư viện máy',
                    style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w800, color: _textPrimary),
                  ),
                  subtitle: const Text(
                    'Tải ảnh từ bộ nhớ điện thoại lên hệ thống',
                    style: TextStyle(fontSize: 12, color: _textSecondary),
                  ),
                  onTap: () {
                    Navigator.pop(sheetCtx);
                    _showToast('Mở thư viện ảnh trên máy (Sẵn sàng nối API upload)');
                  },
                ),
                const Divider(height: 12, color: Color(0xFFE2E8F0)),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: _primaryBlue.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.camera_alt_rounded, color: _primaryBlue),
                  ),
                  title: const Text(
                    'Chụp ảnh mới',
                    style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w800, color: _textPrimary),
                  ),
                  subtitle: const Text(
                    'Sử dụng camera để chụp ảnh đại diện',
                    style: TextStyle(fontSize: 12, color: _textSecondary),
                  ),
                  onTap: () {
                    Navigator.pop(sheetCtx);
                    _showToast('Mở camera chụp ảnh (Sẵn sàng nối API upload)');
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _handleSavePassword() {
    final oldP = _oldPassCtrl.text.trim();
    final newP = _newPassCtrl.text.trim();
    final confirmP = _confirmPassCtrl.text.trim();

    if (oldP.isEmpty || newP.isEmpty || confirmP.isEmpty) {
      _showToast('Vui lòng nhập đầy đủ các ô mật khẩu.', isError: true);
      return;
    }
    if (newP.length < 6) {
      _showToast('Mật khẩu mới phải có ít nhất 6 ký tự.', isError: true);
      return;
    }
    if (newP != confirmP) {
      _showToast('Mật khẩu nhập lại chưa khớp.', isError: true);
      return;
    }

    _oldPassCtrl.clear();
    _newPassCtrl.clear();
    _confirmPassCtrl.clear();
    FocusScope.of(context).unfocus();
    _showToast('Đổi mật khẩu thành công!');
  }

  void _showToast(String msg, {bool isError = false}) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg, style: const TextStyle(fontWeight: FontWeight.w700)),
        backgroundColor: isError ? const Color(0xFFDC2626) : const Color(0xFF047857),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
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
          'Thông tin & Tài khoản',
          style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.w900, color: _textPrimary),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 1. Khu vực tải ảnh đại diện từ máy lên
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  GestureDetector(
                    onTap: _showPickImageOptions,
                    child: Stack(
                      alignment: Alignment.bottomRight,
                      children: [
                        Container(
                          width: 82,
                          height: 82,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: LinearGradient(
                              colors: [_primaryBlue, _gradientCyan],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                          ),
                          child: ClipOval(
                            child: widget.avatarUrl != null && widget.avatarUrl!.isNotEmpty
                                ? Image.network(widget.avatarUrl!, fit: BoxFit.cover)
                                : const Icon(Icons.person_rounded, color: Colors.white, size: 42),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: _primaryBlue,
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                          child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 14),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: _showPickImageOptions,
                    icon: const Icon(Icons.upload_rounded, size: 18, color: _primaryBlue),
                    label: const Text(
                      'Tải ảnh đại diện từ máy',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: _primaryBlue,
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                      side: BorderSide(color: _primaryBlue.withValues(alpha: 0.35)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // 2. Thông tin đầy đủ (đã bỏ Trạng thái & Trường học, bổ sung SĐT phụ huynh)
            const Text(
              'Thông tin đầy đủ',
              style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w900, color: _textPrimary),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  _buildInfoRow(Icons.badge_rounded, 'Mã học sinh', 'HS2026-0614'),
                  const Divider(height: 20, color: Color(0xFFE2E8F0)),
                  _buildInfoRow(Icons.person_rounded, 'Họ và tên', widget.studentName),
                  const Divider(height: 20, color: Color(0xFFE2E8F0)),
                  _buildInfoRow(Icons.email_rounded, 'Gmail', widget.email),
                  if (widget.isSchoolStudent) ...[
                    const Divider(height: 20, color: Color(0xFFE2E8F0)),
                    _buildInfoRow(Icons.class_rounded, 'Lớp', 'Lớp 6A1'),
                    const Divider(height: 20, color: Color(0xFFE2E8F0)),
                    _buildInfoRow(Icons.school_rounded, 'Giáo viên', 'Cô Trần Thị Lan'),
                    const Divider(height: 20, color: Color(0xFFE2E8F0)),
                    _buildInfoRow(Icons.family_restroom_rounded, 'Phụ huynh', 'Nguyễn Văn Hùng'),
                    const Divider(height: 20, color: Color(0xFFE2E8F0)),
                    _buildInfoRow(Icons.phone_rounded, 'SĐT phụ huynh', '0909 123 456'),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 3. Khu vực đổi mật khẩu
            const Text(
              'Đổi mật khẩu',
              style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w900, color: _textPrimary),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildPasswordField(
                    controller: _oldPassCtrl,
                    label: 'Mật khẩu hiện tại',
                    obscure: _obscureOld,
                    onToggle: () => setState(() => _obscureOld = !_obscureOld),
                  ),
                  const SizedBox(height: 12),
                  _buildPasswordField(
                    controller: _newPassCtrl,
                    label: 'Mật khẩu mới (tối thiểu 6 ký tự)',
                    obscure: _obscureNew,
                    onToggle: () => setState(() => _obscureNew = !_obscureNew),
                  ),
                  const SizedBox(height: 12),
                  _buildPasswordField(
                    controller: _confirmPassCtrl,
                    label: 'Nhập lại mật khẩu mới',
                    obscure: _obscureConfirm,
                    onToggle: () => setState(() => _obscureConfirm = !_obscureConfirm),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _handleSavePassword,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _primaryBlue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                    ),
                    child: const Text(
                      'Cập nhật mật khẩu',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: _primaryBlue),
        const SizedBox(width: 10),
        SizedBox(
          width: 112,
          child: Text(
            label,
            style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: _textSecondary),
          ),
        ),
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

  Widget _buildPasswordField({
    required TextEditingController controller,
    required String label,
    required bool obscure,
    required VoidCallback onToggle,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: _textPrimary),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(fontSize: 13, color: _textSecondary),
        filled: true,
        fillColor: const Color(0xFFF8FAFC),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: _primaryBlue, width: 1.4),
        ),
        suffixIcon: IconButton(
          icon: Icon(
            obscure ? Icons.visibility_off_rounded : Icons.visibility_rounded,
            size: 20,
            color: _textSecondary,
          ),
          onPressed: onToggle,
        ),
      ),
    );
  }
}