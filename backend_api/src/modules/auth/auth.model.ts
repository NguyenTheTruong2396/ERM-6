import dbPool from "../../config/database";

const SCHEMA = 'user_management';

// Database type definitions
export interface IUser {
  id: number;
  email: string | null;
  phone_number: string | null;
  parent_phone: string | null;
  password_hash: string | null;
  full_name: string;               // NOT NULL
  role_id: number;                 // NOT NULL
  classroom_id: number | null;
  avatar_url: string | null;
  dob: Date | null;
  gender: boolean;                 // NOT NULL DEFAULT true
  is_active: boolean;              // NOT NULL DEFAULT false
  created_at: Date;
  updated_at: Date;
  google_id: string | null;
}

export interface IOtp {
  id: number;
  target: string;                  // NOT NULL
  otp_code: string;                // NOT NULL
  purpose: 'REGISTER' | 'RESET_PASSWORD' | 'PHONE_LOGIN' | string;
  attempts: number;
  expire_at: Date;
  is_used: boolean;
  created_at: Date;
}

// Data queries
export const AuthModel = {
  // 1. Query users table
  async findUserByEmail(email: string): Promise<IUser | null> {
    const res = await dbPool.query<IUser>(
      `SELECT * FROM ${SCHEMA}.users WHERE email = $1 LIMIT 1`,
      [email]
    );
    return res.rows[0] || null;
  },

  async findUserByPhone(phonenumber: string): Promise<IUser | null> {
    const res = await dbPool.query<IUser>(
      `SELECT * FROM ${SCHEMA}.users WHERE phone_number = $1 LIMIT 1`,
      [phonenumber]
    );
    return res.rows[0] || null;
  },

  async findUserByGoogleOrEmail(googleId: string, email: string): Promise<IUser | null> {
    const res = await dbPool.query<IUser>(
      `SELECT * FROM ${SCHEMA}.users WHERE google_id = $1 OR email = $2 LIMIT 1`,
      [googleId, email]
    );
    return res.rows[0] || null;
  },

  // 2. Create user account with Email
  async createUserWithEmail(
    email: string,
    passwordhash: string,
    fullname: string,
    roleid: number = 3
  ): Promise<IUser | null> {
    const res = await dbPool.query<IUser>(
      `INSERT INTO ${SCHEMA}.users (email, password_hash, full_name, role_id, is_active) 
       VALUES ($1, $2, $3, $4, FALSE) RETURNING *`,
      [email, passwordhash, fullname, roleid]
    );
    return res.rows[0] || null;
  },

  // 3. Update unverified user registration details
  async updateUnverifiedUser(
    email: string,
    passwordHash: string,
    fullName: string,
    roleId: number = 3
  ): Promise<IUser> {
    const res = await dbPool.query<IUser>(
      `UPDATE ${SCHEMA}.users 
       SET password_hash = $1, full_name = $2, role_id = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE email = $4 RETURNING *`,
      [passwordHash, fullName, roleId, email]
    );
    return res.rows[0];
  },

  // 4. Activate user account
  async activateUserByEmail(email: string): Promise<IUser> {
    const res = await dbPool.query<IUser>(
      `UPDATE ${SCHEMA}.users SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP 
       WHERE email = $1 RETURNING *`,
      [email]
    );
    return res.rows[0];
  },

  // 5. Update new password
  async updatePassword(email: string, newPasswordHash: string): Promise<void> {
    await dbPool.query(
      `UPDATE ${SCHEMA}.users SET password_hash = $1, is_active = TRUE, updated_at = CURRENT_TIMESTAMP 
       WHERE email = $2`,
      [newPasswordHash, email]
    );
  },

  // Find active parent account pre-provisioned by school by phone number
  async findActiveParentByPhone(phoneNumber: string): Promise<IUser | null> {
    const res = await dbPool.query<IUser>(
      `SELECT u.* 
       FROM ${SCHEMA}.users u
       JOIN ${SCHEMA}.role r ON u.role_id = r.id
       WHERE u.phone_number = $1 
         AND r.name = 'parent' 
         AND u.is_active = TRUE
       LIMIT 1`,
      [phoneNumber]
    );
    return res.rows[0] || null;
  },

  // Find a user account by Google ID (sub)
  async findUserByGoogleId(googleId: string): Promise<IUser | null> {
    const res = await dbPool.query<IUser>(
      `SELECT * FROM ${SCHEMA}.users WHERE google_id = $1 LIMIT 1`,
      [googleId]
    );
    return res.rows[0] || null;
  },

  // Create a new user account for a first-time login via Google
  async createGoogleUser(data: {
    googleId: string;
    fullName: string;
    avatarUrl?: string | null;
    roleId?: number;
  }): Promise<IUser> {
    const res = await dbPool.query<IUser>(
      `INSERT INTO ${SCHEMA}.users (google_id, full_name, avatar_url, role_id, is_active)
       VALUES ($1, $2, $3, $4, TRUE)
       RETURNING *`,
      [data.googleId, data.fullName, data.avatarUrl || null, data.roleId || 3]
    );
    return res.rows[0];
  },

  // Update the avatar if the account does not yet have a profile picture
  async updateAvatarIfEmpty(userId: number, avatarUrl: string): Promise<void> {
    await dbPool.query(
      `UPDATE ${SCHEMA}.users 
       SET avatar_url = COALESCE(avatar_url, $1), updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [avatarUrl, userId]
    );
  },

  // 6. Query otp table (user_management.otp)
  async invalidateOldOtps(target: string, purpose: string): Promise<void> {
    await dbPool.query(
      `UPDATE ${SCHEMA}.otp SET is_used = TRUE 
       WHERE target = $1 AND purpose = $2 AND is_used = FALSE`,
      [target, purpose]
    );
  },

  async createOtp(target: string, otpCode: string, purpose: string, expireAt: Date): Promise<void> {
    await dbPool.query(
      `INSERT INTO ${SCHEMA}.otp (target, otp_code, purpose, expire_at, attempts, is_used) 
       VALUES ($1, $2, $3, $4, 0, FALSE)`,
      [target, otpCode, purpose, expireAt]
    );
  },

  async findLatestActiveOtp(target: string, purpose: string): Promise<IOtp | null> {
    const res = await dbPool.query<IOtp>(
      `SELECT * FROM ${SCHEMA}.otp 
       WHERE target = $1 AND purpose = $2 AND is_used = FALSE AND expire_at > CURRENT_TIMESTAMP
       ORDER BY created_at DESC LIMIT 1`,
      [target, purpose]
    );
    return res.rows[0] || null;
  },

  async incrementOtpAttempts(otpId: number): Promise<void> {
    await dbPool.query(
      `UPDATE ${SCHEMA}.otp 
       SET attempts = attempts + 1, is_used = CASE WHEN attempts + 1 >= 5 THEN TRUE ELSE is_used END 
       WHERE id = $1`,
      [otpId]
    );
  },

  async markOtpAsUsed(otpId: number): Promise<void> {
    await dbPool.query(
      `UPDATE ${SCHEMA}.otp SET is_used = TRUE WHERE id = $1`,
      [otpId]
    );
  },
};
