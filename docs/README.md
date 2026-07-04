# Docs

Documentation for **@myko.pk/health**.

## Available Docs

| Document | Description |
|----------|-------------|
| [QUICK-START.md](./QUICK-START.md) | 5-minute setup guide — install, register checks, DI usage |

## Module Reference

All public APIs are documented in the [README](../README.md):

- **`HealthModule.forRoot(checks)`** — Register health checks synchronously
- **`HealthModule.forRootAsync(options)`** — Register health checks with DI
- **`HealthCheck`** — Interface: `{ name: string; check: () => boolean | Promise<boolean> }`
- **`HealthCheckResult`** — Type: `{ name: string; status: 'up' | 'down' }`
- **`HEALTH_CHECKS`** — Injection token `'HEALTH_CHECKS'`
