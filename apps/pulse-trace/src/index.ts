import { createBaseServer, loadEnv, PulseInfra } from '@pulsestack/core';

const env = loadEnv();
const infra = new PulseInfra();
const app = await createBaseServer('pulse-trace');

app.get('/executions/:executionId', async (request) => {
  return infra.readTrace((request.params as { executionId: string }).executionId);
});

app.get('/search', async (request) => {
  const executionId = (request.query as { executionId?: string }).executionId;
  return executionId ? infra.readTrace(executionId) : [];
});

await app.listen({ host: '0.0.0.0', port: env.HTTP_PORT });
