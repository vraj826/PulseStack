export function onEvent(event) {
  console.log('[plugin:audit-log]', event.type, event.correlationId);
}
