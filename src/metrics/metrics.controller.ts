import { Controller, Get, Headers, Inject, Req, RequestTimeoutException } from '@nestjs/common';
import type { Request } from 'express';
import { ResponseBuilder } from '@myko.pk/response';
import { MetricsService } from './metrics.service';
import { PrometheusService } from './prometheus.service';

const METRICS_TIMEOUT = 5_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new RequestTimeoutException(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);
}

@Controller('metrics')
export class MetricsController {
  constructor(
    @Inject(MetricsService) private readonly metricsService: MetricsService,
    @Inject(PrometheusService) private readonly prometheusService: PrometheusService,
  ) {}

  @Get()
  async index(@Req() req: Request, @Headers('accept') accept?: string) {
    if (accept && accept.includes('text/plain')) {
      const body = await withTimeout(
        this.prometheusService.scrape(),
        METRICS_TIMEOUT,
        'prometheusScrape',
      );
      return body;
    }

    const [system, custom] = await Promise.all([
      withTimeout(this.metricsService.collectSystem(), METRICS_TIMEOUT, 'collectSystem'),
      withTimeout(this.metricsService.collectCustom(), METRICS_TIMEOUT, 'collectCustom'),
    ]);

    return ResponseBuilder.success(
      { system, custom },
      'Metrics collected',
      200,
      req.headers['x-request-id'] as string | undefined,
    );
  }
}
