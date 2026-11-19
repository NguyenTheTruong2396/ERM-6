import nodemailer from 'nodemailer';
import dbPool from '../../config/database';

const SCHEMA = 'system_management';

const getSmtpConfig = async () => {
  const res = await dbPool.query(
    `SELECT smtp_email, smtp_password FROM ${SCHEMA}.setting LIMIT 1`
  );

  if (!res.rows || res.rows.length === 0) {
    throw new Error('SMTP configuration is not found in system_management.setting table!');
  }

  return {
    smtp_email: res.rows[0].smtp_email,
    smtp_password: res.rows[0].smtp_password,
  };
};

export const sendEmailOTP = async (toEmail: string, otpCode: string, subject: string) => {
  const { smtp_email, smtp_password } = await getSmtpConfig();

  if (!smtp_email || !smtp_password) {
    throw new Error('SMTP configuration (smtp_email or smtp_password) is empty in the system!');
  }

  // Configure nodemailer transport via Gmail App Password
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
        <h2>Your OTP Verification Code</h2>
        <p>The OTP code is valid for <b>5 minutes</b>:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #2563eb; margin: 16px 0;">
          ${otpCode}
        </div>
        <p>Please do not share this code with anyone.</p>
      </div>
    `,
  });
};
