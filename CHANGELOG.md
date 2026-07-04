# Changelog

## 1.0.0 (2026-07-04)

### Initial Release

Standardised health check module for MYKO NestJS services. Exposes a `GET /health` endpoint that runs configurable health checks and returns a unified `ApiResponse` envelope.

#### Key Exports
- **`HealthModule.forRoot(checks)`** — register health checks synchronously
- **`HealthModule.forRootAsync(options)`** — register health checks with dependency injection
- **`HealthCheck`** — interface for health check definitions
- **`HealthCheckResult`** — per-check status type
- **`HEALTH_CHECKS`** — injection token for custom provider access
