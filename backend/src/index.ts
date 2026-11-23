import { app } from './app.js';
import { pool } from './config/database.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(`Sports Facility Hub API listening on http://localhost:${env.port}`);
});

server.on('error', () => {
  console.error('API server could not start. Check the configured port.');
  process.exit(1);
});

let shuttingDown = false;

function shutdown(): void {
  if (shuttingDown) return;
  shuttingDown = true;

  const forceExit = setTimeout(() => process.exit(1), 10000);
  forceExit.unref();

  server.close(() => {
    void pool.end().then(
      () => {
        clearTimeout(forceExit);
        process.exitCode = 0;
      },
      () => process.exit(1),
    );
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
