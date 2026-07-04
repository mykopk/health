import { Controller, Get, Inject, Req } from '@nestjs/common';
import { Request } from 'express';
import { ResponseBuilder } from '@myko.pk/response';
import { HEALTH_CHECKS } from './health.constants';
import { HealthCheck } from './health.interface';

@Controller('health')
export class HealthController {
  private readonly appName: string;

  constructor(
    @Inject(HEALTH_CHECKS) private readonly checks: HealthCheck[],
  ) {
    try {
      const pkg = require(process.cwd() + '/package.json');
      this.appName = pkg.name || 'unknown';
    } catch {
      this.appName = 'unknown';
    }
  }

  @Get()
  async check(@Req() req: Request) {
    const results = await Promise.all(
      this.checks.map(async (c) => {
        try {
          const ok = await c.check();
          return { name: c.name, status: ok ? 'up' as const : 'down' as const };
        } catch {
          return { name: c.name, status: 'down' as const };
        }
      }),
    );

    const allUp = results.every(r => r.status === 'up');

    return ResponseBuilder.success(
      {
        name: this.appName,
        uptime: process.uptime(),
        checks: results,
      },
      allUp ? 'Service healthy' : 'Service degraded',
      allUp ? 200 : 503,
      req.headers['x-request-id'] as string | undefined,
    );
  }
}
