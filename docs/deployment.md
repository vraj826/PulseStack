# Deployment

## Local

1. Start infrastructure:
   `docker compose -f infra/docker/docker-compose.yml up -d`
2. Install dependencies:
   `pnpm install`
3. Run services:
   `pnpm dev`

Default ports:

- `pulse-gateway`: `4000`
- `pulse-runtime`: `4101`
- `pulse-events`: `4102`
- `pulse-trace`: `4103`
- `pulse-replay`: `4104`
- `pulse-metrics`: `4105`
- `pulse-graph`: `4106`
- `pulse-web`: `3000`

## Kubernetes

Apply `infra/k8s/*.yaml` after publishing images, or install the Helm chart from `infra/helm/pulsestack`.
