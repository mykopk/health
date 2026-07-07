import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Controller, Get, Inject, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ResponseBuilder } from '@myko.pk/response';
import { HEALTH_CHECKS } from './health.constants';
import type { HealthCheck, HealthCheckReturn } from './health.interface';

@Controller('health')
export class HealthController {
  private _appName: string | null = null;

  constructor(
    @Inject(HEALTH_CHECKS) private readonly checks: HealthCheck[],
  ) {}

  private getAppName(): string {
    if (this._appName === null) {
      try {
        const pkg = JSON.parse(
          readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
        ) as { name?: string };
        this._appName = pkg.name || 'unknown';
      } catch {
        this._appName = 'unknown';
      }
    }
    return this._appName;
  }

  @Get()
  async check(@Req() req: Request) {
    const results = await Promise.all(
      this.checks.map(async (c) => {
        try {
          const raw: HealthCheckReturn = await c.check();
          if (typeof raw === 'object' && raw !== null) {
            return {
              name: c.name,
              status: raw.status ? 'up' as const : 'down' as const,
              ...(raw.detail ? { detail: raw.detail } : {}),
            };
          }
          return { name: c.name, status: raw ? 'up' as const : 'down' as const };
        } catch {
          return { name: c.name, status: 'down' as const };
        }
      }),
    );

    const allUp = results.every(r => r.status === 'up');

    return ResponseBuilder.success(
      {
        name: this.getAppName(),
        uptime: process.uptime(),
        checks: results,
      },
      allUp ? 'Service healthy' : 'Service degraded',
      allUp ? 200 : 503,
      req.headers['x-request-id'] as string | undefined,
    );
  }
}
