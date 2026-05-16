# PulseStack Architecture

PulseStack is organized as a TypeScript monorepo with shared contracts, a shared infra layer, independently deployable service entrypoints, and a React operations console.

## Services

- `pulse-runtime`: workflow execution, state snapshots, event emission, span creation.
- `pulse-events`: event ingress, NATS fanout, Redis Streams buffering, websocket stream delivery.
- `pulse-trace`: execution trace retrieval over ClickHouse.
- `pulse-replay`: deterministic replay from persisted snapshots and side-effect recordings.
- `pulse-metrics`: event volume and latency aggregations from ClickHouse.
- `pulse-graph`: DAG reconstruction from stored workflow definitions.
- `pulse-gateway`: API gateway and websocket bridge for the UI and SDKs.
- `pulse-web`: real-time operations console.

## Data Plane

1. `pulse-runtime` stores workflow definitions in PostgreSQL.
2. Executions are inserted into PostgreSQL and step snapshots are written after each step.
3. Events are published to NATS, appended to Redis Streams, and inserted into ClickHouse.
4. Trace spans are stored in ClickHouse for timeline analysis and latency aggregation.
5. `pulse-replay` reads stored snapshots and reconstructs a deterministic replay state with a diff against the original output.

## Storage

- PostgreSQL: workflow metadata, executions, replay snapshots.
- Redis: event stream fanout and ephemeral queue state.
- ClickHouse: high-volume event and trace analytics.
- NATS: low-latency event bus.
