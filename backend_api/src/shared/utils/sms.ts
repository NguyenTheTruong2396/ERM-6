import dbPool from '../../config/database';

const SCHEMA = 'system_management';

interface SmsSettings {
  url: string;
  token: string;
}

// Function to read SMS configuration from setting table
const getSmsSettingsFromDb = async (): Promise<SmsSettings> => {
  const result = await dbPool.query(
    `SELECT sms_gateway_url, sms_gateway_token 
     FROM ${SCHEMA}.setting 
     LIMIT 1`
  );

  const row = result.rows[0] || {};
  const url = process.env.SMS_API_URL || row.sms_gateway_url || "http://127.0.0.1:5001/api/sms/send";
  const token = process.env.SMS_API_KEY || row.sms_gateway_token || "erm6_sms_gateway_secret_2026";

  console.log(`[SMS DEBUG] Connecting to Gateway URL: ${url}`);

  if (!url || !token) {
    throw new Error('sms_gateway_url or sms_gateway_token is not configured in setting table!');
  }

  return { url, token };
};

export const sendSmsOtp = async (phoneNumber: string, otpCode: string): Promise<void> => {
  try {
    // 1. Get configuration from setting table
    const { url, token } = await getSmsSettingsFromDb();

    // 2. Call HTTP POST to SMS Server
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': token,
      },
      body: JSON.stringify({
        phoneNumber,
        content: `[ERM-6] Your parent login OTP code is: ${otpCode}. Valid for 5 minutes.`,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({})) as { message?: string };
      throw new Error(`Failed to send SMS: ${errData.message || response.statusText}`);
    }
  } catch (error: any) {
    // In development environment, simulate SMS by printing OTP to console for testing convenience
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.warn(`\n[DEV SMS SIMULATION] Unable to send SMS via Gateway (${error.message}).`);
      if (error.cause) {
        console.warn(`[DETAILED REASON]:`, error.cause);
      }
      console.warn(`>>> PARENT LOGIN OTP CODE FOR (${phoneNumber}) IS: [ ${otpCode} ] <<<\n`);
      return;
    }
    throw error;
  }
};
