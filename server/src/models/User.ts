import { dbManager } from '../config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'user' | 'remote_employee' | 'admin';
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  login_attempts: number;
  locked_until?: Date;
  password_reset_token?: string;
  password_reset_expires?: Date;
  discount_code?: string; // For remote employees
  referral_points?: number; // For remote employees
  referred_by?: string; // For users who used a discount code
  subscription_plan?: string;
  letters_used?: number;
}

export class UserModel {
  private static async ensureConnection(role: string): Promise<void> {
    const isConnected = await dbManager.testConnection(role);
    if (!isConnected) {
      const connected = await dbManager.waitForConnection(role, 3, 1000);
      if (!connected) {
        throw new Error(`Database connection unavailable for role: ${role}`);
      }
    }
  }

  static async createUser(
    userData: {
      email: string;
      name: string;
      password: string;
      role: 'user' | 'remote_employee' | 'admin';
      discountCode?: string;
    }
  ): Promise<User> {
    const { email, name, password, role, discountCode } = userData;
    
    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Generate unique ID and discount code for remote employees
    const userId = uuidv4();
    const employeeDiscountCode = role === 'remote_employee' 
      ? `REMOTE${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      : undefined;

    const query = `
      INSERT INTO users (
        id, email, name, password_hash, role, email_verified, created_at, updated_at,
        login_attempts, discount_code, referral_points, referred_by, letters_used
      ) VALUES (
        $1, $2, $3, $4, $5, $6, NOW(), NOW(), 0, $7, $8, $9, $10
      ) RETURNING *
    `;

    const values = [
      userId,
      email.toLowerCase(),
      name,
      passwordHash,
      role,
      false, // email_verified
      employeeDiscountCode,
      role === 'remote_employee' ? 0 : null, // referral_points
      discountCode || null, // referred_by
      role === 'user' ? 0 : null // letters_used
    ];

    const result = await dbManager.query(role, query, values);
    return result.rows[0];
  }

  static async findByEmail(email: string, role: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await dbManager.query(role, query, [email.toLowerCase()]);
    return result.rows[0] || null;
  }

  static async findById(id: string, role: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await dbManager.query(role, query, [id]);
    return result.rows[0] || null;
  }

  static async updateUser(id: string, role: string, updates: Partial<User>): Promise<User> {
    await this.ensureConnection(role);
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = $1 
      RETURNING *
    `;
    
    const values = [id, ...Object.values(updates)];
    const result = await dbManager.query(role, query, values);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updatePassword(id: string, role: string, newPassword: string): Promise<void> {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    await this.updateUser(id, role, {
      password_hash: passwordHash,
      password_reset_token: undefined,
      password_reset_expires: undefined
    } as Partial<User>);
  }

  static async incrementLoginAttempts(id: string, role: string): Promise<void> {
    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5');
    const lockoutTime = parseInt(process.env.LOCKOUT_TIME || '900000'); // 15 minutes

    const query = `
      UPDATE users 
      SET 
        login_attempts = login_attempts + 1,
        locked_until = CASE 
          WHEN login_attempts + 1 >= $2 THEN NOW() + INTERVAL '${lockoutTime} milliseconds'
          ELSE locked_until
        END
      WHERE id = $1
    `;
    
    await dbManager.query(role, query, [id, maxAttempts]);
  }

  static async resetLoginAttempts(id: string, role: string): Promise<void> {
    await this.updateUser(id, role, {
      login_attempts: 0,
      locked_until: undefined,
      last_login: new Date()
    } as Partial<User>);
  }

  static async isAccountLocked(user: User): Promise<boolean> {
    if (!user.locked_until) return false;
    
    const now = new Date();
    const lockedUntil = new Date(user.locked_until);
    
    return now < lockedUntil;
  }

  static async findByDiscountCode(discountCode: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE discount_code = $1 AND role = $2';
    const result = await dbManager.query('remote_employee', query, [discountCode, 'remote_employee']);
    return result.rows[0] || null;
  }

  static async getAllUsers(role: string): Promise<User[]> {
    if (role !== 'admin') {
      throw new Error('Unauthorized: Only admin can access all users');
    }
    
    await this.ensureConnection('admin');
    
    // Admin can see users from all tenants - this would require special admin privileges
    const query = `
      SELECT id, email, name, role, created_at, last_login, subscription_plan, letters_used
      FROM users 
      ORDER BY created_at DESC
    `;
    
    const result = await dbManager.query('admin', query);
    return result.rows;
  }
}