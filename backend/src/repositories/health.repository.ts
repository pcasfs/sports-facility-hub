import type { RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database.js';

export async function pingDatabase(): Promise<boolean> {
  const [rows] = await pool.query<RowDataPacket[]>({
    sql: 'SELECT 1 AS healthy',
    timeout: 5000,
  });
  return rows[0]?.healthy === 1;
}
