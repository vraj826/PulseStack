create table if not exists workflows (
  id text primary key,
  tenant_id text not null,
  name text not null,
  version text not null,
  definition jsonb not null,
  correlation_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists executions (
  id text primary key,
  workflow_id text not null references workflows(id),
  tenant_id text not null,
  correlation_id text not null,
  status text not null,
  input jsonb not null,
  output jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists snapshots (
  id text primary key,
  execution_id text not null references executions(id),
  workflow_id text not null references workflows(id),
  sequence integer not null,
  state jsonb not null,
  side_effects jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_executions_workflow_id on executions(workflow_id);
create index if not exists idx_executions_correlation_id on executions(correlation_id);
create index if not exists idx_snapshots_execution_id on snapshots(execution_id);
