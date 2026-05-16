# Replay Engine

Replay uses persisted `snapshots` rows plus recorded side effects to reconstruct an execution timeline without triggering external side effects.

## Flow

1. `pulse-runtime` writes a snapshot after each step.
2. Each snapshot records the current workflow state and the step response.
3. `pulse-replay` loads the snapshots in sequence, reconstructs final replay state, and produces a diff against the original execution output.

## API

- `POST /api/replay/:executionId`
