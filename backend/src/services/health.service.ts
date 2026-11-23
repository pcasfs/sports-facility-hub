import { pingDatabase } from '../repositories/health.repository.js';

export async function checkDatabaseHealth(): Promise<void> {
  if (!(await pingDatabase())) {
    throw new Error('Database health check failed');
  }
}
