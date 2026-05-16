import { createBaseServer, loadEnv, PulseInfra } from '@pulsestack/core';

const env = loadEnv();
const infra = new PulseInfra();
const app = await createBaseServer('pulse-metrics');

app.get('/summary', async () => infra.readMetrics());

await app.listen({ host: '0.0.0.0', port: env.HTTP_PORT });
