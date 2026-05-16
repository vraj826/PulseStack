import pino from 'pino';
import { loadEnv } from './config.js';

export function createLogger(service: string) {
  const env = loadEnv();
  return pino({
    name: service,
    level: env.LOG_LEVEL,
    transport:
      env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:standard' },
          }
        : undefined,
  });
}
