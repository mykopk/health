# Quick Start

## Installation

```bash
npm install @myko.pk/health
```

## 1. Register Static Checks

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

Access `GET /health` to get:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service healthy",
  "data": {
    "name": "myko-app",
    "uptime": 3600,
    "checks": [
      { "name": "server", "status": "up" },
      { "name": "database", "status": "up" }
    ]
  },
  "timestamp": "2026-07-04T12:00:00.000Z"
}
```

## 2. Register with Dependency Injection

```ts
import { HealthModule } from '@myko.pk/health';
import { RedisService } from '@myko/common-packages/cache/redis';

@Module({
  imports: [
    HealthModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redis: RedisService) => [
        { name: 'redis', check: () => redis.ping() },
      ],
    }),
  ],
})
export class AppModule {}
```

## 3. Response Format

- All checks `up` → `200` with `"Service healthy"`
- Any check `down` → `503` with `"Service degraded"`
- Response is wrapped in `ApiResponse` via `@myko.pk/response`

## What's Next?

See the [full README](../README.md) for the complete API reference.
