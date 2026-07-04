<p align="center">
  <h1 align="center">@myko.pk/health</h1>
  <p align="center"><strong>Health checks. Standardised.</strong></p>
  <p align="center">Health check module for MYKO NestJS services. Provides a standardised `/health` endpoint with configurable health checks and a dynamic module API.</p>
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
- [API](#api)
- [Available Scripts](#available-scripts)
- [Contributors](#contributors)
- [Contributing](#contributing)
- [License](#license)

## 📝 Description

@myko.pk/health provides a standardised health check endpoint for NestJS services. Register one or more `HealthCheck` callbacks and the module exposes a `GET /health` endpoint that runs all checks and returns a unified `ApiResponse` envelope via `@myko.pk/response`.

## ✨ Key Features

- **🩺 Configurable Health Checks** — Register sync or async check functions per dependency (database, redis, etc.)
- **🏗️ Dynamic Module API** — `forRoot(checks)` or `forRootAsync({ inject, useFactory })` for dependency injection
- **📦 Standard Response** — Returns `ApiResponse` via `@myko.pk/response` with per-check `up`/`down` status
- **📘 Fully Typed** — Full TypeScript support with typed health check interfaces

## ⚡ Quick Start

```bash
npm install @myko.pk/health
```

```ts
import { Module } from '@nestjs/common';
import { HealthModule } from '@myko.pk/health';

@Module({
  imports: [
    HealthModule.forRoot([
      {
        name: 'database',
        check: async () => {
          // return true/false
        },
      },
      {
        name: 'redis',
        check: () => redis.ping(),
      },
    ]),
  ],
})
export class AppModule {}
```

Or with async factory:

```ts
HealthModule.forRootAsync({
  inject: [RedisService],
  useFactory: (redis: RedisService) => [
    { name: 'redis', check: () => redis.ping() },
  ],
})
```

## API

### `HealthModule.forRoot(checks)`

| Param | Type | Description |
|-------|------|-------------|
| `checks` | `HealthCheck[]` | Array of health checks with `name` and `check` function |

### `HealthModule.forRootAsync(options)`

| Option | Type | Description |
|--------|------|-------------|
| `imports` | `any[]` | Modules to import for DI |
| `inject` | `any[]` | Providers to inject into factory |
| `useFactory` | `(...args) => HealthCheck[]` | Factory returning checks |

### `HealthCheck`

```ts
interface HealthCheck {
  name: string;
  check: () => Promise<boolean> | boolean;
}
```

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
