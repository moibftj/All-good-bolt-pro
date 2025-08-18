import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  tenantId: string;
}

export const databaseConfigs: Record<string, DatabaseConfig> = {
  admin: {
    host: process.env.ADMIN_DB_HOST!,
    port: parseInt(process.env.ADMIN_DB_PORT!),
    database: process.env.ADMIN_DB_NAME!,
    user: process.env.ADMIN_DB_USER!,
    password: process.env.ADMIN_DB_PASSWORD!,
    tenantId: process.env.ADMIN_TENANT_ID!
  },
  user: {
    host: process.env.USER_DB_HOST!,
    port: parseInt(process.env.USER_DB_PORT!),
    database: process.env.USER_DB_NAME!,
    user: process.env.USER_DB_USER!,
    password: process.env.USER_DB_PASSWORD!,
    tenantId: process.env.USER_TENANT_ID!
  },
  remote_employee: {
    host: process.env.EMPLOYEE_DB_HOST!,
    port: parseInt(process.env.EMPLOYEE_DB_PORT!),
    database: process.env.EMPLOYEE_DB_NAME!,
    user: process.env.EMPLOYEE_DB_USER!,
    password: process.env.EMPLOYEE_DB_PASSWORD!,
    tenantId: process.env.EMPLOYEE_TENANT_ID!
  }
};

class DatabaseManager {
  private pools: Record<string, Pool> = {};

  constructor() {
    // Initialize connection pools for each tenant
    Object.entries(databaseConfigs).forEach(([key, config]) => {
      try {
        this.pools[key] = new Pool({
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: {
            rejectUnauthorized: false // Nile requires SSL
          },
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });
        
        // Add error handler for pool
        this.pools[key].on('error', (err) => {
          console.error(`Database pool error for ${key}:`, err);
        });
      } catch (error) {
        console.error(`Failed to create database pool for ${key}:`, error);
      }
    });
  }

  getPool(userType: string): Pool {
    const pool = this.pools[userType];
    if (!pool) {
      throw new Error(`Database pool not found for user type: ${userType}`);
    }
    return pool;
  }

  async testConnection(userType: string): Promise<boolean> {
    try {
      const pool = this.getPool(userType);
      const client = await pool.connect();
      
      try {
        // Set tenant context and test with a simple query
        const tenantId = databaseConfigs[userType].tenantId;
        await client.query(`SET nile.tenant_id = '${tenantId}'`);
        await client.query('SELECT 1');
        return true;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(`Database connection test failed for ${userType}:`, error);
      return false;
    }
  }

  async waitForConnection(userType: string, maxRetries = 5, retryInterval = 2000): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      const isConnected = await this.testConnection(userType);
      if (isConnected) {
        console.log(`✅ Database connection established for ${userType}`);
        return true;
      }
      
      if (i < maxRetries - 1) {
        console.log(`⏳ Database connection attempt ${i + 1}/${maxRetries} failed for ${userType}. Retrying in ${retryInterval}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryInterval));
      }
    }
    
    console.error(`❌ Failed to establish database connection for ${userType} after ${maxRetries} attempts`);
    return false;
  }

  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const userType of Object.keys(databaseConfigs)) {
      results[userType] = await this.testConnection(userType);
    }
    
    return results;
  }

  async query(userType: string, text: string, params?: any[]) {
    // Check if connection is available before querying
    const isConnected = await this.testConnection(userType);
    if (!isConnected) {
      throw new Error(`Database connection not available for user type: ${userType}`);
    }

    const pool = this.getPool(userType);
    const client = await pool.connect();
    
    try {
      // Set tenant context for Nile
      const tenantId = databaseConfigs[userType].tenantId;
      await client.query(`SET nile.tenant_id = '${tenantId}'`);
      
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async closeAll() {
    await Promise.all(
      Object.values(this.pools).map(pool => pool.end())
    );
  }
}

export const dbManager = new DatabaseManager();