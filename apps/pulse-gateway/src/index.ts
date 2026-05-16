import { createBaseServer, loadEnv } from '@pulsestack/core';
import { request } from 'undici';

const env = loadEnv();
type JwtCapableApp = Awaited<ReturnType<typeof createBaseServer>> & {
  jwt: {
    sign(payload: Record<string, unknown>): string;
  };
  get(path: string, opts: { websocket: true }, handler: WebsocketHandlerLike): unknown;
};

type JwtCapableRequest = {
  url: string;
  headers: {
    authorization?: string;
    'x-api-key'?: string | string[];
  };
  jwtVerify(): Promise<unknown>;
};

type WebsocketLike = {
  send(data: string): void;
  on(event: 'close', listener: () => void): void;
};

type WebsocketHandlerLike = (socket: WebsocketLike) => void | Promise<void>;

const app = (await createBaseServer('pulse-gateway')) as JwtCapableApp;

const services = {
  runtime: process.env.RUNTIME_URL ?? 'http://localhost:4101',
  events: process.env.EVENTS_URL ?? 'http://localhost:4102',
  trace: process.env.TRACE_URL ?? 'http://localhost:4103',
  replay: process.env.REPLAY_URL ?? 'http://localhost:4104',
  metrics: process.env.METRICS_URL ?? 'http://localhost:4105',
  graph: process.env.GRAPH_URL ?? 'http://localhost:4106',
};

async function proxyJson(url: string, init?: { method?: string; body?: unknown }) {
  const response = await request(url, {
    method: init?.method ?? 'GET',
    headers: { 'content-type': 'application/json' },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  return response.body.json();
}

app.post('/auth/token', async (request) => {
  const body = (request.body as { apiKey?: string }) ?? {};
  if (body.apiKey !== env.API_KEY) {
    return app.jwt.sign({ sub: 'anonymous', tenantId: env.TENANT_ID, denied: true });
  }
  return { token: app.jwt.sign({ sub: 'operator', tenantId: env.TENANT_ID }) };
});

app.addHook('preHandler', async (request, reply) => {
  const jwtRequest = request as unknown as JwtCapableRequest;
  if (!request.url.startsWith('/api') || env.AUTH_DISABLED) return;
  const bearer = jwtRequest.headers.authorization?.replace(/^Bearer\s+/i, '');
  const apiKey = jwtRequest.headers['x-api-key'];
  if (apiKey === env.API_KEY) return;
  if (!bearer) return reply.code(401).send({ message: 'Unauthorized' });
  await jwtRequest.jwtVerify();
});

app.post('/api/runtime/executions', async (request) => proxyJson(`${services.runtime}/executions`, { method: 'POST', body: request.body }));
app.get('/api/runtime/executions', async () => proxyJson(`${services.runtime}/executions`));
app.get('/api/runtime/executions/:executionId', async (request) =>
  proxyJson(`${services.runtime}/executions/${(request.params as { executionId: string }).executionId}`),
);
app.get('/api/events/recent', async () => proxyJson(`${services.events}/recent`));
app.get('/api/traces/:executionId', async (request) =>
  proxyJson(`${services.trace}/executions/${(request.params as { executionId: string }).executionId}`),
);
app.get('/api/graph/:executionId', async (request) =>
  proxyJson(`${services.graph}/executions/${(request.params as { executionId: string }).executionId}/dag`),
);
app.get('/api/metrics/summary', async () => proxyJson(`${services.metrics}/summary`));
app.post('/api/replay/:executionId', async (request) =>
  proxyJson(`${services.replay}/executions/${(request.params as { executionId: string }).executionId}/replay`, {
    method: 'POST',
  }),
);

const eventsStreamHandler: WebsocketHandlerLike = async (socket) => {
  const upstream = new WebSocket(`${services.events.replace('http', 'ws')}/stream`);
  upstream.onmessage = (event) => socket.send(event.data.toString());
  socket.on('close', () => upstream.close());
};

app.get('/ws/events', { websocket: true }, eventsStreamHandler);

await app.listen({ host: '0.0.0.0', port: env.HTTP_PORT });
