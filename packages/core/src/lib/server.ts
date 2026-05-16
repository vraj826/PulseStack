import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import jwt from '@fastify/jwt';
import { loadEnv } from './config.js';
import { createLogger } from './logger.js';

export async function createBaseServer(service: string) {
  const env = loadEnv();
  const logger = createLogger(service);
  const app = Fastify({ logger });

  await app.register(cors, { origin: true });
  await app.register(rateLimit, { max: 250, timeWindow: '1 minute' });
  await app.register(jwt, { secret: env.JWT_SECRET });
  await app.register(swagger, {
    openapi: {
      info: {
        title: `${service} API`,
        version: '0.1.0',
      },
    },
  });
  await app.register(swaggerUi, { routePrefix: '/docs' });
  await app.register(websocket);

  app.decorate('verifyTenant', async (request: any) => {
    const headerTenant = request.headers['x-tenant-id'];
    request.tenantId = typeof headerTenant === 'string' ? headerTenant : env.TENANT_ID;
  });

  app.addHook('onRequest', async (request) => {
    request.log.info({
      event: 'audit.request',
      method: request.method,
      url: request.url,
      tenantId: request.headers['x-tenant-id'] ?? env.TENANT_ID,
    });
  });

  app.get('/health', async () => ({ status: 'ok', service }));
  return app;
}
