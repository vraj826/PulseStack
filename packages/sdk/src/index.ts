import type { ExecutionRequest } from '@pulsestack/contracts';
import { request } from 'undici';

export class PulseClient {
  constructor(private readonly baseUrl: string, private readonly apiKey?: string) {}

  async startWorkflow(payload: ExecutionRequest) {
    const response = await request(`${this.baseUrl}/api/runtime/executions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    return response.body.json();
  }

  async getExecution(executionId: string) {
    const response = await request(`${this.baseUrl}/api/runtime/executions/${executionId}`);
    return response.body.json();
  }
}
