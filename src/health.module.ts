import { DynamicModule, Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HEALTH_CHECKS } from './health.constants';
import { HealthCheck } from './health.interface';

interface HealthModuleAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => HealthCheck[] | Promise<HealthCheck[]>;
  inject?: any[];
}

@Module({})
export class HealthModule {
  static forRoot(checks: HealthCheck[] = []): DynamicModule {
    return {
      module: HealthModule,
      controllers: [HealthController],
      providers: [
        { provide: HEALTH_CHECKS, useValue: checks },
      ],
    };
  }

  static forRootAsync(options: HealthModuleAsyncOptions): DynamicModule {
    return {
      module: HealthModule,
      imports: options.imports ?? [],
      controllers: [HealthController],
      providers: [
        {
          provide: HEALTH_CHECKS,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
      ],
    };
  }
}
