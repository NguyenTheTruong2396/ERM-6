import { Pool } from 'pg';
import dotenv from 'dotenv';
// nạp các biến môi trường từ tệp .env vào process.env
dotenv.config();

// kiểm tra xem biến môi trường DATABASE_URL có tồn tại hay không
if (!process.env.DATABASE_URL) {
    throw new Error('Biến DATABASE_URL không được định nghĩa trong tệp .env');
}

// cấu hình để kết nối tới database PostgreSQL sử dụng thư viện pg và NeonDB
const dbPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 10,
    idleTimeoutMillis: 30000, // tự đóng kết nối sau 30 giây không sử dụng
    connectionTimeoutMillis: 5000, //Báo lối nếu không thể kết nối tới database sau 5 giây
});

dbPool.on('error', (err) => {
    console.error('Lỗi kết nối tới database PostgreSQL:', err);
    process.exit(1); // thoát ứng dụng nếu không thể kết nối tới database
});

export default dbPool;