# Quick Start

## Installation

```bash
npm install @myko.pk/health
```

## 1. Health Checks

```ts
import { Module } from '@nestjs/common';
import { HealthModule } from '@myko.pk/health';

@Module({
  imports: [
    HealthModule.forRoot([
      { name: 'server', check: () => true },
      { name: 'database', check: async () => {
        // Return true/false based on DB health
      }},
    ]),
  ],
})
export class AppModule {}
```

`GET /health` → `200` with `"Service healthy"` or `503` with `"Service degraded"`.

## 2. System Metrics

```ts
import { Module } from '@nestjs/common';
import { MetricsModule } from '@myko.pk/health';

@Module({
  imports: [
    MetricsModule.forRoot(),
  ],
})
export class AppModule {}
```

`GET /metrics` returns CPU, memory, process & OS info:

```json
{
  "success": true,
  "data": {
    "system": {
      "cpu": { "usage": 34.2, "loads": [1.5, 0.8, 0.6] },
      "memory": { "total": 16777216000, "free": 8388608000, "used": 8388608000, "heapUsed": 512000000, "heapTotal": 1024000000 },
      "process": { "uptime": 3600, "pid": 12345, "nodeVersion": "v22.0.0" },
      "os": { "hostname": "my-server-1", "platform": "darwin", "uptime": 99999 }
    },
    "custom": {}
  }
}
```

## 3. Custom Metrics

Track application-specific values:

```ts
MetricsModule.forRoot({
  customMetrics: [
    {
      name: 'active_connections',
      help: 'Number of active WebSocket connections',
      collect: () => wsServer.clients.size,
    },
    {
      name: 'db_pool_size',
      help: 'Current database connection pool size',
      collect: () => dbPool.totalCount,
    },
  ],
})
```

Custom metrics appear under `data.custom` in the `/metrics` response.

## 4. Async Setup (with DI)

```ts
MetricsModule.forRootAsync({
  imports: [DatabaseModule],
  inject: [DatabaseService],
  useFactory: (db: DatabaseService) => ({
    customMetrics: [
      {
        name: 'db_pool_size',
        help: 'Database connection pool size',
        collect: () => db.getPoolSize(),
      },
    ],
  }),
})
```

## What's Next?

- [README.md](../README.md) — full API reference
