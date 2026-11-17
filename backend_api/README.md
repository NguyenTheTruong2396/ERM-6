backend_api/src/modules/
├── 01. auth/           # Đăng ký, Đăng nhập (Google, SĐT), Quên MK, OTP, RBAC 4 Roles
├── 02. users/          # Quản lý người dùng, Hồ sơ cá nhân, Import Excel
├── 03. family/         # Ghép nối Phụ huynh - Học sinh qua SĐT & mã OTP
├── 04. classes/        # Quản lý Lớp học, Phân công Giáo viên phụ trách
├── 05. curriculum/     # Nội dung 12 Unit SGK 6 (Từ vựng, Ngữ pháp, Audio, Đọc, Flashcard)
├── 06. questions/      # Ngân hàng câu hỏi (đa dạng loại câu), Tagging mã KC, Độ khó
├── 07. tests/          # Quản lý & Cấu hình Đề thi (Unit Test, giữa kỳ, sinh đề theo ma trận)
├── 08. submissions/    # Làm bài, Nộp bài, Tự động chấm điểm thang 10, Bóc tách câu sai
├── 09. analytics/      # Knowledge Tracing (% thành thạo KC), Dashboard Phổ điểm & Lỗ hổng
├── 10. learning-paths/ # Gợi ý lộ trình AI (Rule-based), Bài tập Micro-learning bù đắp kiến thức
├── 11. speech-ai/      # Nhận diện giọng nói (Speech-to-Text), So khớp & Chấm điểm phát âm
├── 12. gamification/   # Tích lũy điểm thưởng (XP), Huy hiệu, Chuỗi ngày học, Bảng xếp hạng
├── 13. notifications/  # Push Notification phụ huynh khi con nộp bài, Nhắc nhở, Banner
└── 14. audit-logs/     # Giám sát nhật ký hoạt động hệ thống cho Quản trị viên

cách chạy server: mở terminal ngay tại backend_api õ lênh: "npm run dev"