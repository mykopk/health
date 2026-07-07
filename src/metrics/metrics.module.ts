import { DynamicModule, Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { PrometheusService } from './prometheus.service';
import { CUSTOM_METRICS } from './metrics.constants';
import { CustomMetricDefinition } from './metrics.interface';

interface MetricsModuleOptions {
  customMetrics?: CustomMetricDefinition[];
}

interface MetricsModuleAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => MetricsModuleOptions | Promise<MetricsModuleOptions>;
  inject?: any[];
}

@Module({})
export class MetricsModule {
  static forRoot(options: MetricsModuleOptions = {}): DynamicModule {
    return {
      module: MetricsModule,
      controllers: [MetricsController],
      providers: [
        MetricsService,
        PrometheusService,
        {
          provide: CUSTOM_METRICS,
          useValue: options.customMetrics ?? [],
        },
      ],
    };
  }

  static forRootAsync(options: MetricsModuleAsyncOptions): DynamicModule {
    return {
      module: MetricsModule,
      imports: options.imports ?? [],
      controllers: [MetricsController],
      providers: [
        MetricsService,
        PrometheusService,
        {
          provide: CUSTOM_METRICS,
          useFactory: async (...args: unknown[]) => {
            const opts = await options.useFactory(...args);
            return opts.customMetrics ?? [];
          },
          inject: options.inject ?? [],
        },
      ],
    };
  }
}
