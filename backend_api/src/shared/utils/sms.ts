import dbPool from '../../config/database';

const SCHEMA = 'system_management';

interface SmsSettings {
  url: string;
  token: string;
}

// Hàm đọc cấu hình SMS trực tiếp từ bảng setting
const getSmsSettingsFromDb = async (): Promise<SmsSettings> => {
  const result = await dbPool.query(
    `SELECT sms_gateway_url, sms_gateway_token 
     FROM ${SCHEMA}.setting 
     LIMIT 1`
  );

  const row = result.rows[0] || {};
  const url = process.env.SMS_API_URL || row.sms_gateway_url || "http://127.0.0.1:5001/api/sms/send";
  const token = process.env.SMS_API_KEY || row.sms_gateway_token || "erm6_sms_gateway_secret_2026";

  console.log(`[SMS DEBUG] Đang kết nối tới Gateway URL: ${url}`);

  if (!url || !token) {
    throw new Error('Chưa cấu hình sms_gateway_url hoặc sms_gateway_token trong bảng setting!');
  }

  return { url, token };
};

export const sendSmsOtp = async (phoneNumber: string, otpCode: string): Promise<void> => {
  try {
    // 1. Lấy cấu hình từ bảng setting
    const { url, token } = await getSmsSettingsFromDb();

    // 2. Gọi HTTP POST sang SMS Server
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': token,
      },
      body: JSON.stringify({
        phoneNumber,
        content: `[ERM-6] Ma OTP dang nhap danh cho phu huynh cua ban la: ${otpCode}. Co hieu luc trong 5 phut.`,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({})) as { message?: string };
      throw new Error(`Gửi SMS thất bại: ${errData.message || response.statusText}`);
    }
  } catch (error: any) {
    // Trong môi trường development, nếu chưa cấu hình SMS Gateway thì in OTP ra terminal để thuận tiện test
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.warn(`\n[DEV SMS SIMULATION] Không thể gửi SMS qua Gateway (${error.message}).`);
      if (error.cause) {
        console.warn(`[LÝ DO CHI TIẾT]:`, error.cause);
      }
      console.warn(`>>> MÃ OTP ĐĂNG NHẬP PHỤ HUYNH (${phoneNumber}) LÀ: [ ${otpCode} ] <<<\n`);
      return;
    }
    throw error;
  }
};
