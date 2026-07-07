import { Inject, Injectable } from '@nestjs/common';
import {
  Registry,
  Gauge,
  collectDefaultMetrics,
} from 'prom-client';
import { CUSTOM_METRICS } from './metrics.constants';
import { CustomMetricDefinition } from './metrics.interface';

@Injectable()
export class PrometheusService {
  private readonly register: Registry;
  private readonly gauges: Map<string, Gauge<string>> = new Map();

  constructor(
    @Inject(CUSTOM_METRICS) private readonly customMetrics: CustomMetricDefinition[],
  ) {
    this.register = new Registry();

    for (const def of customMetrics) {
      const gauge = new Gauge({
        name: def.name,
        help: def.help,
        labelNames: def.labelNames ?? [],
        registers: [this.register],
      });
      this.gauges.set(def.name, gauge);
    }

    collectDefaultMetrics({ register: this.register });
  }

  async scrape(): Promise<string> {
    for (const metric of this.customMetrics) {
      try {
        const value = await metric.collect();
        const gauge = this.gauges.get(metric.name);
        if (!gauge) continue;
        if (typeof value === 'object' && metric.labelNames) {
          for (const [labelValue, count] of Object.entries(value)) {
            gauge.set({ [metric.labelNames[0]]: labelValue }, count);
          }
        } else if (typeof value === 'number') {
          gauge.set(value);
        }
      } catch {
        // skip failed metrics
      }
    }
    return this.register.metrics();
  }

  contentType(): string {
    return this.register.contentType;
  }
}
