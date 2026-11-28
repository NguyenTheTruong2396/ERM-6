enum UserRole {
  studentSchool, // Học sinh tài khoản trường cấp
  studentPersonal, // Học sinh tự học / cá nhân
  parent, // Phụ huynh (đăng nhập bằng SĐT & OTP)
}

extension UserRoleExtension on UserRole {
  String get displayName {
    switch (this) {
      case UserRole.studentSchool:
        return 'Học sinh (Trường cấp)';
      case UserRole.studentPersonal:
        return 'Cá nhân';
      case UserRole.parent:
        return 'Phụ huynh học sinh';
    }
  }

  String get description {
    switch (this) {
      case UserRole.studentSchool:
        return 'Sử dụng tài khoản do trường/giáo viên cấp để vào lớp';
      case UserRole.studentPersonal:
        return 'Tự học với lộ trình cá nhân hóa Tiếng Anh 6';
      case UserRole.parent:
        return 'Theo dõi tiến độ, điểm số và lỗ hổng kiến thức của con';
    }
  }
}

