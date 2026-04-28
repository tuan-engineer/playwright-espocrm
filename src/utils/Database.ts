import mysql, { type Pool, type PoolConnection } from 'mysql2/promise';
import { CONFIG } from '@cfg';

export class Database {
  private pool: Pool;
  constructor() {
    this.pool = mysql.createPool({
      host: CONFIG.ENV.DATABASE_HOST,
      user: CONFIG.ENV.DATABASE_USER,
      password: CONFIG.ENV.DATABASE_PASSWORD,
      database: CONFIG.ENV.DATABASE_NAME,
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  async cleanTestData(keyword: string): Promise<void> {
    const tables = [
      { name: 'account', column: 'description' },
      { name: 'lead', column: 'description' },
      { name: 'contact', column: 'description' },
    ];
    for (const table of tables) {
      const sql = `DELETE FROM \`${table.name}\` WHERE \`${table.column}\` LIKE ?`;
      await this.query(sql, [`%${keyword}%`]);
      console.log(`>>> Đã dọn dẹp bảng: ${table.name}`);
    }
  }
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows as T[];
    } catch (error: any) {
      this.logError(sql, params, error);
      throw error;
    }
  }
  async transaction(callback: (connection: PoolConnection) => Promise<void>): Promise<void> {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try {
      await callback(connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error('--- TRANSACTION ROLLBACKED ---');
      throw error;
    } finally {
      connection.release();
    }
  }
  private logError(sql: string, params: any[], error: any) {
    console.error('\x1b[31m%s\x1b[0m', '>>> DATABASE ERROR <<<'); // In màu đỏ
    console.error('SQL:', sql);
    console.error('Params:', JSON.stringify(params));
    console.error('Error Message:', error.message);
  }
  async close() {
    await this.pool.end();
  }
}
