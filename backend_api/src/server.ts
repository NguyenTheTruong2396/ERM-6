import dotenv from "dotenv";
dotenv.config();


 import dbPool from "./config/database";
 import app from "./app";

  const PORT = process.env.PORT || 5000;

  const startServer = async () => {
    try {
        //kiêm tra kết nối db
        const client = await dbPool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('Kết nối tới database PostgreSQL thành công. Thời gian hiện tại:', result.rows[0].now);

        //Mở cổng lắng nghe các request từ client
        const server = app.listen(PORT, () => {
            console.log(`Server đang chạy ở chế độ [${process.env.NODE_ENV||'development'}] trên cổng: http://localhost:${PORT}`);
        });

        //Xử lý tắt server ăn toàn khi ctrl+C hoặc kill process
        const gracefulShutdown = async () => {
            console.log('\nĐang tắt server và đóng kết nối Database...');
            server.close(async () => {
                await dbPool.end();
                console.log('Đã đóng toàn bộ kết nối PostgreSQL an toàn.');
                process.exit(0);
            });
        };

        process.on('SIGINT', gracefulShutdown);  // Bắt tín hiệu Ctrl + C trên terminal
        process.on('SIGTERM', gracefulShutdown); // Bắt tín hiệu tắt từ hệ thống cloud/Docker                                                                                               
    }catch(error){
        console.error('Lỗi khi khởi động server:', error);
        process.exit(1); // thoát ứng dụng nếu không thể kết nối tới database
    }
};

startServer();