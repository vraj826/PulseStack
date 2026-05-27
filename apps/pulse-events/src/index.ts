import type { WebsocketHandler } from '@fastify/websocket';
import { createBaseServer, createEvent, loadEnv, publishEvent, PulseInfra } from '@pulsestack/core';
import { eventEnvelopeSchema, eventTypeSchema, type EventType } from '@pulsestack/contracts';

const env = loadEnv();
const infra = new PulseInfra();
const app = await createBaseServer('pulse-events');

app.post('/ingest', async (request) => {
  const event = eventEnvelopeSchema.parse(request.body);
  await publishEvent(infra, event);
  return { accepted: true, id: event.id };
});

app.post<{ Params: { type: string }; Body: Record<string, unknown> }>('/emit/:type', async (request) => {
  const eventType: EventType = eventTypeSchema.parse(request.params.type);
  const event = createEvent({
    type: eventType,
    source: 'pulse-events',
    tenantId: env.TENANT_ID,
    correlationId: request.headers['x-correlation-id']?.toString() ?? 'manual',
    payload: request.body ?? {},
  });
  await publishEvent(infra, event);
  return event;
});

const streamHandler: WebsocketHandler = async (socket) => {
  const nc = await infra.nats();
  const subscription = nc.subscribe('pulse.events.>');
  (async () => {
    for await (const message of subscription) {
      socket.send(message.string());
    }
  })();
  socket.on('close', () => subscription.unsubscribe());
};

app.get('/stream', { websocket: true }, streamHandler);

app.get('/recent', async () => infra.readRecentEvents());

await app.listen({ host: '0.0.0.0', port: env.HTTP_PORT });
