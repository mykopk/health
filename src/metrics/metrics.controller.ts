import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { ResponseBuilder } from '@myko.pk/response';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async index(@Req() req: Request) {
    const [system, custom] = await Promise.all([
      this.metricsService.collectSystem(),
      this.metricsService.collectCustom(),
    ]);

    return ResponseBuilder.success(
      { system, custom },
      'Metrics collected',
      200,
      req.headers['x-request-id'] as string | undefined,
    );
  }
}
