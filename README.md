# PulseStack

Observability and Runtime Intelligence for Distributed AI Workflows.

## What is included

- AI-native workflow runtime
- distributed event pipeline
- ClickHouse-backed tracing and metrics
- deterministic replay service
- DAG graph service
- TypeScript SDK
- plugin loading primitives
- React operations console
- Docker Compose, Kubernetes, and Helm assets

## Run locally

```bash
docker compose -f infra/docker/docker-compose.yml up -d
pnpm install
pnpm dev
```

Open:

- Gateway: `http://localhost:4000`
- UI: `http://localhost:3000`
- Swagger docs: `http://localhost:4101/docs` and equivalent on each service

## Sample workflow payload

```json
{
  "workflow": {
    "id": "wf_agent_ops",
    "name": "Agent Ops",
    "version": "1.0.0",
    "tenantId": "local",
    "correlationId": "corr_agent_ops",
    "metadata": {},
    "steps": [
      { "id": "s1", "name": "Plan", "kind": "agent", "dependsOn": [], "input": { "objective": "inspect queue health" } },
      { "id": "s2", "name": "FetchLogs", "kind": "tool", "dependsOn": ["s1"], "input": { "tool": "logs.query", "range": "15m" } },
      { "id": "s3", "name": "Summarize", "kind": "llm", "dependsOn": ["s2"], "input": { "model": "gpt-4.1", "prompt": "Summarize anomalies" } }
    ]
  },
  "input": {
    "environment": "prod"
  },
  "initiatedBy": "operator"
}
```
