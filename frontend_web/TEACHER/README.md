# CỔNG GIÁO VIÊN - ENGLISH 6 TEACHER PORTAL

Giao diện Web App dành riêng cho Giáo viên bộ môn Tiếng Anh 6 quản lý lớp học, theo dõi tiến độ nộp bài và phân tích lỗ hổng kiến thức của học sinh.

---

## 💎 Quy tắc Thiết kế & Công nghệ (100% UI/UX Thuần túy)
- **Công nghệ:** ReactJS (TypeScript) + Tailwind CSS + Lucide Icons.
- **Phong cách:** Doanh nghiệp tối giản (Stripe / Apple / Linear).
- **Màu sắc:** Bảng 3 màu chủ đạo (Nền sáng `#FAFAFA`, chữ đen xám `slate-900`, viền siêu mỏng `border-slate-200/80`).
- **Thẻ thống kê:** Chỉ gồm Tiêu đề nhỏ + Con số to đậm (Đã bỏ toàn bộ các dòng chữ nhỏ, phần trăm phụ bên dưới).
- **Bảng dữ liệu:**
  - Cột đầu tiên là **Mã ID** (Font mono), **KHÔNG có ô checkbox**.
  - Khung tìm kiếm đặt ở **thanh công cụ bên dưới** ngay cạnh bộ lọc Dropdown.
  - Cột thao tác: **100% Nút Icon** kích thước vuông chuẩn 28x28px (`w-7 h-7`).
  - Thanh phân trang thích ứng (Desktop hiển thị dãy số, Mobile thu gọn `← Trước | Trang 1/3 | Sau →`).
- **Dữ liệu & Chức năng:** 100% UI/UX tĩnh, KHÔNG kết nối cơ sở dữ liệu hay API Backend nào.

---

## 📂 Danh sách các màn hình giao diện đã hoàn thiện

1. **Dashboard tiến độ giảng dạy (`/teacher/dashboard`):**
   - 4 thẻ thống kê tổng quan (Học sinh phụ trách, Lớp giảng dạy, Tỷ lệ nộp bài, Điểm trung bình).
   - Biểu đồ phân bổ phổ điểm cả 2 lớp (Giỏi, Khá, Trung bình, Cần bồi dưỡng).
   - Tiến độ hoàn thành 6 Unit Học kỳ 1 của từng lớp.
   - Bảng cảnh báo nhanh Top 3 lỗ hổng kiến thức cần lưu ý trong tuần.

2. **Lớp học phụ trách (`/teacher/classes`):**
   - Thẻ thông tin các lớp được phân công (Lớp 6A1, Lớp 6A2).
   - Tỷ lệ nộp bài, điểm trung bình, phân bổ học lực thanh ngang.
   - Nút chuyển nhanh sang danh sách học sinh và phân tích lỗi.

3. **Học sinh & Lịch sử bài làm (`/teacher/students`):**
   - Bảng 90 học sinh với bộ lọc theo Lớp và theo Học lực (Tất cả, Giỏi, Khá, Trung bình, Cần bồi dưỡng).
   - Tìm kiếm theo Tên, Mã ID, Email.
   - Popup Modal chi tiết hồ sơ học sinh (`StudentDetailModal`).
   - Popup Modal xem chi tiết bài làm kiểm tra (`ExamSubmissionModal`): xem từng câu hỏi, đáp án học sinh chọn, đáp án chuẩn, KC Tag và giải thích.

4. **Phân tích lỗ hổng kiến thức của lớp (`/teacher/knowledge-gaps`):**
   - Thống kê các thành phần kiến thức (Knowledge Components - KC Tags) mà học sinh làm sai nhiều nhất.
   - Tỷ lệ học sinh sai, phân loại theo Ngữ pháp, Từ vựng, Phát âm, Kỹ năng Nghe.
   - Gợi ý sư phạm cho giáo viên điều chỉnh giáo án trên lớp.

5. **Theo dõi Lộ trình học tập cá nhân hóa (`/teacher/ai-tracking`):**
   - Giám sát mức độ thành thạo kiến thức (Mastery level %) của từng học sinh.
   - Danh sách bài học bổ trợ (Micro-learning) do động cơ AI đề xuất theo độ ưu tiên (Cao, Vừa, Thấp).

---

## 🚀 Hướng dẫn khởi chạy xem giao diện

Mở Terminal và gõ:
```bash
cd f:\DNCN\UI\TEACHER
npm run dev
```
Sau đó mở trình duyệt truy cập: **`http://localhost:3001`**

