# Changelog

## 1.1.0 (2026-07-04)

### Added

- **`MetricsModule.forRoot()` / `forRootAsync()`** — system metrics collection module
- **`GET /metrics`** — endpoint returning CPU usage, load averages, memory (total/free/used/heap), process info (uptime/pid/version), OS info (hostname/platform/uptime)
- **`CustomMetricDefinition`** — register your own metrics via `customMetrics` option (e.g. active connections, pool sizes)
- **`MetricsService`** — injectable service for programmatic metric collection
- **`SystemMetrics`, `CpuMetrics`, `MemoryMetrics`, `ProcessMetrics`, `OsMetrics`** — typed metric interfaces

### Dependencies

- Zero new runtime dependencies — uses only `node:os` and `process`

## 1.0.0 (2026-07-04)

### Initial Release

Standardised health check module for MYKO NestJS services. Exposes a `GET /health` endpoint that runs configurable health checks and returns a unified `ApiResponse` envelope.

#### Key Exports
- **`HealthModule.forRoot(checks)`** — register health checks synchronously
- **`HealthModule.forRootAsync(options)`** — register health checks with dependency injection
- **`HealthCheck`** — interface for health check definitions
- **`HealthCheckResult`** — per-check status type
- **`HEALTH_CHECKS`** — injection token for custom provider access
