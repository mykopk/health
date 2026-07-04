<p align="center">
  <h1 align="center">@myko.pk/health</h1>
  <p align="center"><strong>Health checks. Metrics. Standardised.</strong></p>
  <p align="center">Observability toolkit for MYKO NestJS services. Health checks, system metrics, and custom metric tracking — all wrapped in a standard `ApiResponse` envelope.</p>
  <p align="center">
    <a href="https://www.npmjs.com/package/@myko.pk/health"><img src="https://img.shields.io/npm/v/@myko.pk/health?style=for-the-badge&logo=npm&logoColor=white" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@myko.pk/health"><img src="https://img.shields.io/npm/dm/@myko.pk/health?style=for-the-badge&logo=npm&logoColor=white" alt="npm downloads"></a>
    <a href="https://github.com/mykopk/health/actions"><img src="https://img.shields.io/github/actions/workflow/status/mykopk/health/ci.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=CI" alt="build"></a>
    <a href="https://github.com/mykopk/health"><img src="https://img.shields.io/github/stars/mykopk/health?style=for-the-badge&logo=github" alt="stars"></a>
    <a href="https://github.com/mykopk/health"><img src="https://img.shields.io/github/forks/mykopk/health?style=for-the-badge&logo=github" alt="forks"></a>
    <a href="https://github.com/mykopk/health"><img src="https://img.shields.io/github/issues/mykopk/health?style=for-the-badge&logo=github" alt="issues"></a>
    <a href="https://github.com/mykopk/health"><img src="https://img.shields.io/github/last-commit/mykopk/health?style=for-the-badge&logo=github" alt="last commit"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="license"></a>
  </p>
</p>

## 📑 Table of Contents

- [Description](#description)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Modules](#modules)
  - [HealthModule](#healthmodule)
  - [MetricsModule](#metricsmodule)
- [API Reference](#api-reference)
- [Available Scripts](#available-scripts)
- [Contributors](#contributors)
- [Contributing](#contributing)
- [License](#license)

## 📝 Description

@myko.pk/health is an observability toolkit for MYKO NestJS services. It provides:

- **Health checks** — register one or more check functions and get a standardised `/health` endpoint
- **System metrics** — automatic CPU, memory, process, and OS metrics at `/metrics`
- **Custom metrics** — track your own application-specific values (connections, queue depth, pool sizes, etc.)

All responses use the standard `@myko.pk/response` `ApiResponse` envelope.

## ✨ Key Features

- **🩺 Health Checks** — Register sync or async check functions per dependency (database, redis, etc.)
- **📊 System Metrics** — Automatic CPU usage, load averages, memory (total/free/used/heap), process info, OS info
- **⚙️ Custom Metrics** — Define your own numeric metrics with a `collect` callback
- **🏗️ Dynamic Modules** — `forRoot()` and `forRootAsync()` for both HealthModule and MetricsModule
- **📦 Standard Response** — All endpoints return `ApiResponse` via `@myko.pk/response`
- **📘 Fully Typed** — Full TypeScript support with interfaces for all metric types
- **🔋 Zero Extra Dependencies** — Metrics use only Node.js built-in `node:os` and `process`

## ⚡ Quick Start

```bash
npm install @myko.pk/health
```

### Health Checks

```ts
import { Module } from '@nestjs/common';
import { HealthModule } from '@myko.pk/health';

@Module({
  imports: [
    HealthModule.forRoot([
      { name: 'database', check: async () => { /* return true/false */ } },
      { name: 'redis',    check: () => redis.ping() },
    ]),
  ],
})
export class AppModule {}
```

Access `GET /health`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service healthy",
  "data": {
    "name": "myko-app",
    "uptime": 3600,
    "checks": [
      { "name": "database", "status": "up" },
      { "name": "redis",    "status": "up" }
    ]
  },
  "timestamp": "2026-07-04T12:00:00.000Z"
}
```

### System + Custom Metrics

```ts
import { Module } from '@nestjs/common';
import { MetricsModule } from '@myko.pk/health';

@Module({
  imports: [
    MetricsModule.forRoot({
      customMetrics: [
        {
          name: 'active_connections',
          help: 'Active WebSocket connections',
          collect: () => wsServer.clients.size,
        },
      ],
    }),
  ],
})
export class AppModule {}
```

Access `GET /metrics`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Metrics collected",
  "data": {
    "system": {
      "cpu": {
        "usage": 34.2,
        "loads": [1.5, 0.8, 0.6]
      },
      "memory": {
        "total": 16777216000,
        "free": 8388608000,
        "used": 8388608000,
        "heapUsed": 512000000,
        "heapTotal": 1024000000
      },
      "process": {
        "uptime": 3600,
        "pid": 12345,
        "nodeVersion": "v22.0.0"
      },
      "os": {
        "hostname": "my-server-1",
        "platform": "darwin",
        "uptime": 99999
      }
    },
    "custom": {
      "active_connections": 42
    }
  },
  "timestamp": "2026-07-04T12:00:00.000Z"
}
```

## Modules

### HealthModule

| Method | Description |
|--------|-------------|
| `forRoot(checks)` | Register health checks synchronously |
| `forRootAsync(options)` | Register health checks with dependency injection |

**`HealthCheck`**:

```ts
interface HealthCheck {
  name: string;
  check: () => Promise<boolean> | boolean;
}
```

**`HealthModule.forRootAsync`**:

```ts
HealthModule.forRootAsync({
  imports: [RedisModule],
  inject: [RedisService],
  useFactory: (redis: RedisService) => [
    { name: 'redis', check: () => redis.ping() },
  ],
})
```

### MetricsModule

| Method | Description |
|--------|-------------|
| `forRoot(options)` | Register metrics collection with optional custom metrics |
| `forRootAsync(options)` | Register metrics collection with dependency injection |

**`MetricsModuleOptions`**:

```ts
interface MetricsModuleOptions {
  customMetrics?: CustomMetricDefinition[];
}
```

**`CustomMetricDefinition`**:

```ts
interface CustomMetricDefinition {
  name: string;
  help: string;
  collect: () => number | Promise<number>;
}
```

## API Reference

### Endpoints

| Method | Path | Description | Module |
|--------|------|-------------|--------|
| GET | `/health` | Run all health checks, return aggregate status | HealthModule |
| GET | `/metrics` | Collect system + custom metrics | MetricsModule |

### Types

| Type | Description |
|------|-------------|
| `SystemMetrics` | CPU, memory, process, OS metrics |
| `CpuMetrics` | `usage` (%), `loads` [1m, 5m, 15m] |
| `MemoryMetrics` | `total`, `free`, `used`, `heapUsed`, `heapTotal` |
| `ProcessMetrics` | `uptime`, `pid`, `nodeVersion` |
| `OsMetrics` | `hostname`, `platform`, `uptime` |
| `CustomMetricDefinition` | User-defined metric with name, help, collect callback |
| `MetricsResponse` | Combined system + custom metrics |

### DI Tokens

| Token | Description |
|-------|-------------|
| `HEALTH_CHECKS` | Injection token for registered health checks |
| `CUSTOM_METRICS` | Injection token for custom metric definitions |

## 🚀 Available Scripts

- **build** — `npm run build`
- **dev** — `npm run dev`
- **typecheck** — `npm run typecheck`

## 👥 Contributors

<p align="left">
<a href="https://github.com/arsalanwahab" title="arsalanwahab"><img src="https://avatars.githubusercontent.com/u/178069156?v=4&s=64" width="64" height="64" alt="arsalanwahab" style="border-radius:50%" /></a>
</p>

[See the full list of contributors →](https://github.com/mykopk/health/graphs/contributors)

## 👥 Contributing

Contributions are welcome! Here's the standard flow:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/mykopk/health.git`
3. **Branch**: `git checkout -b feature/your-feature`
4. **Commit**: `git commit -m 'feat: add some feature'`
5. **Push**: `git push origin feature/your-feature`
6. **Open** a pull request

Please follow the existing code style and include tests for new behavior where applicable.

## 📜 License

This project is licensed under the **MIT** License.


MYKO Pakistan

Detail	Information
Website	myko.pk
Email	support@myko.pk
About	Building digital infrastructure and super-app experiences for millions of users across Pakistan.
Built with ❤️ in Pakistan 🇵🇰
