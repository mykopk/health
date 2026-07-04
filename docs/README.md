# Docs

Documentation for **@myko.pk/health**.

## Available Docs

| Document | Description |
|----------|-------------|
| [QUICK-START.md](./QUICK-START.md) | 5-minute setup — health checks, metrics, custom metrics |

## Module Reference

### HealthModule

- **`forRoot(checks)`** — `HealthCheck[]` → DynamicModule
- **`forRootAsync({ imports, inject, useFactory })`** — DynamicModule
- **Endpoint**: `GET /health`

### MetricsModule

- **`forRoot({ customMetrics })`** → DynamicModule
- **`forRootAsync({ imports, inject, useFactory })`** → DynamicModule
- **Endpoint**: `GET /metrics`

### Types

| Type | File | Description |
|------|------|-------------|
| `HealthCheck` | `health.interface.ts` | `{ name, check }` |
| `HealthCheckResult` | `health.interface.ts` | `{ name, status: 'up' | 'down' }` |
| `HealthResponse` | `health.interface.ts` | `{ status, uptime, timestamp, checks }` |
| `SystemMetrics` | `metrics.interface.ts` | CPU, memory, process, OS |
| `CustomMetricDefinition` | `metrics.interface.ts` | `{ name, help, collect }` |
| `MetricsResponse` | `metrics.interface.ts` | `{ system, custom }` |
