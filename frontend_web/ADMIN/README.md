# ENGLISH 6 - ADMIN PORTAL (HỆ THỐNG LỘ TRÌNH TIẾNG ANH 6)
> Giao diện Quản trị viên Doanh nghiệp (Enterprise Minimalism) - ReactJS + TypeScript + Tailwind CSS

---

## 1. CÁCH CHẠY DỰ ÁN

### Bước 1: Mở terminal tại thư mục `ADMIN`
```bash
cd f:\DNCN\UI\ADMIN
```

### Bước 2: Cài đặt thư viện (nếu chưa cài)
```bash
npm install
```

### Bước 3: Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Trình duyệt sẽ tự động mở hoặc bạn truy cập vào: **`http://localhost:3000`**

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
ADMIN/
├── .env                        # File cấu hình kết nối Backend API
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.js
│
├── src/
│   ├── layouts/                # Bố cục giao diện
│   │   └── AdminLayout/        # Sidebar (submenu + pill +12), Header, Footer
│   │
│   ├── features/               # CÁC TRANG CHỨC NĂNG (FEATURE-BASED)
│   │   ├── dashboard/          # DashboardPage (Tổng quan, biểu đồ, tác vụ nhanh)
│   │   ├── users/              # StudentListPage, TeacherListPage, ParentListPage, AdminListPage
│   │   │   └── components/     # UserDetailModal (Hồ sơ AI), ImportExcelModal (Nhập Excel)
│   │   ├── classes/            # ClassListPage (Quản lý lớp, phân công GV)
│   │   ├── curriculum/         # UnitListPage (12 Unit SGK, từ vựng, quản lý file nghe MP3)
│   │   ├── question-bank/      # QuestionListPage (Trắc nghiệm, điền từ, gắn thẻ KC Tags)
│   │   ├── exams/              # ExamListPage (Ma trận sinh đề tự động, cấu hình thi)
│   │   ├── banners/            # BannerListPage (Thông báo trang chủ)
│   │   └── audit-logs/         # AuditLogPage (Nhật ký thao tác hệ thống)
│   │
│   ├── services/               # TẦNG KẾT NỐI BACKEND API
│   │   ├── api.client.ts       # Cấu hình gọi fetch/axios đính kèm JWT token
│   │   ├── user.service.ts     # API CRUD Người dùng, Import Excel
│   │   ├── class.service.ts    # API Lớp học
│   │   ├── curriculum.service.ts # API 12 Unit, upload Audio MP3
│   │   ├── question.service.ts # API Ngân hàng câu hỏi
│   │   ├── exam.service.ts     # API Đề thi, sinh đề ma trận
│   │   └── audit.service.ts    # API Nhật ký hoạt động
│   │
│   ├── types/                  # ĐỊNH NGHĨA TYPESCRIPT (INTERFACES)
│   │   ├── user.types.ts
│   │   ├── class.types.ts
│   │   ├── curriculum.types.ts
│   │   ├── question.types.ts
│   │   ├── exam.types.ts
│   │   └── audit.types.ts
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx       # Định tuyến toàn bộ các trang con
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
```

---

## 3. HƯỚNG DẪN KẾT NỐI VỚI BACKEND API

Dự án đã được thiết kế sẵn theo mô hình **Mock-First**:

1. **Khi chưa có Backend hoặc Backend đang code:**
   - Trong file `.env`: để nguyên `VITE_USE_MOCK=true`.
   - Giao diện sẽ tự động dùng dữ liệu mẫu giả lập chất lượng cao được viết sẵn trong `src/services/`.
   - Bạn có thể thao tác thêm, sửa, xóa, lọc bảng, chuyển trang, mở popup bình thường.

2. **Khi Backend của bạn đã viết xong:**
   - Mở file `.env` và sửa:
     ```env
     VITE_API_BASE_URL=http://localhost:5000/api
     VITE_USE_MOCK=false
     ```
   - Trong các file `src/services/*.service.ts`, các hàm gọi API thật đã được viết sẵn mẫu. Bạn chỉ cần sửa endpoint (đường dẫn URL) cho khớp với Backend của bạn là toàn bộ giao diện sẽ ăn theo Database thật!

