import { createBaseServer, loadEnv, PulseInfra, ReplayEngine } from '@pulsestack/core';

const env = loadEnv();
const infra = new PulseInfra();
const replay = new ReplayEngine(infra);
const app = await createBaseServer('pulse-replay');

app.post('/executions/:executionId/replay', async (request) => {
  return replay.replayExecution((request.params as { executionId: string }).executionId);
});

await app.listen({ host: '0.0.0.0', port: env.HTTP_PORT });
