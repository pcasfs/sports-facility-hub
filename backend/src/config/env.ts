import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// src/config와 dist/config에서 모두 backend/.env를 읽는다.
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function port(name: string, fallback: number): number {
  const value = process.env[name] ?? String(fallback);
  const parsed = Number(value);
  if (!/^\d+$/.test(value) || !Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid port environment variable: ${name}`);
  }
  return parsed;
}

const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
const originUrl = new URL(corsOrigin);
if (!['http:', 'https:'].includes(originUrl.protocol) || originUrl.origin !== corsOrigin) {
  throw new Error('CORS_ORIGIN must be an HTTP(S) origin without a trailing slash');
}

export const env = {
  port: port('PORT', 3000),
  corsOrigin,
  db: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: port('DB_PORT', 3307),
    database: process.env.DB_NAME ?? 'sports_facility_hub',
    user: process.env.DB_USER ?? 'sports_app',
    password: required('DB_PASSWORD'),
  },
};
