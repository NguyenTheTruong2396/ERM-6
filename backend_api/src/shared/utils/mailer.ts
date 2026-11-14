import nodemailer from 'nodemailer';
import dbPool from '../../config/database';

const SCHEMA = 'system_management';

const getSmtpConfig = async () => {
  const res = await dbPool.query(
    `SELECT smtp_email, smtp_password FROM ${SCHEMA}.setting LIMIT 1`
  );

  if (!res.rows || res.rows.length === 0) {
    throw new Error('Chưa cấu hình thông tin SMTP trong bảng system_management.setting!');
  }

  return {
    smtp_email: res.rows[0].smtp_email,
    smtp_password: res.rows[0].smtp_password,
  };
};

export const sendEmailOTP = async (toEmail: string, otpCode: string, subject: string) => {
  const { smtp_email, smtp_password } = await getSmtpConfig();

  if (!smtp_email || !smtp_password) {
    throw new Error('Thông tin cấu hình SMTP (smtp_email hoặc smtp_password) đang bị trống trong hệ thống!');
  }

  // Cấu hình nodemailer gửi mail qua Gmail App Password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtp_email,
      pass: smtp_password,
    },
  });

  await transporter.sendMail({
    from: `"ERM-6 System" <${smtp_email}>`,
    to: toEmail,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Mã xác thực OTP của bạn</h2>
        <p>Mã OTP có hiệu lực trong <b>5 phút</b>:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #2563eb; margin: 16px 0;">
          ${otpCode}
        </div>
        <p>Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
      </div>
    `,
  });
};
