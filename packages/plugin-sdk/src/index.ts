import type { EventEnvelope, PluginManifest } from '@pulsestack/contracts';

export type PulsePluginContext = {
  service: string;
  tenantId: string;
};

export interface PulsePlugin {
  manifest: PluginManifest;
  onEvent?(event: EventEnvelope, context: PulsePluginContext): Promise<void> | void;
}
