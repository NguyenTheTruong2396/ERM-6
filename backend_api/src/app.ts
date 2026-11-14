import express, {Application, Request, Response, NextFunction} from "express";
import cors from "cors";

// khơi tạo ứng dụng Express
const app: Application = express();
// cấu hình middleware cho ứng dụng Express
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route kiểm tra server sống hay chưa (Health check)
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "ERM-6 API Server is running!" });
});

import authRoutes from "./modules/auth/auth.route";
// Gắn toàn bộ route của module auth vào tiền tố /api/auth
app.use("/api/auth", authRoutes);

// Xử lý lỗi khi gọi sai đường dẫn (404 Not Found)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy đường dẫn: ${req.method} ${req.originalUrl}`,
  });
});

export default app;