import type { Request, Response } from 'express';
import { checkDatabaseHealth } from '../services/health.service.js';

export function getHealth(_request: Request, response: Response): void {
  response.json({ status: 'ok', message: 'Sports Facility Hub API is running' });
}

export async function getDatabaseHealth(_request: Request, response: Response): Promise<void> {
  try {
    await checkDatabaseHealth();
    response.json({ status: 'ok', message: 'Database connection is healthy' });
  } catch {
    response.status(503).json({ status: 'error', message: 'Database is unavailable' });
  }
}
