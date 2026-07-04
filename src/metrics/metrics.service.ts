import { Inject, Injectable } from '@nestjs/common';
import * as os from 'node:os';
import { CUSTOM_METRICS } from './metrics.constants';
import {
  CustomMetricDefinition,
  CpuMetrics,
  MemoryMetrics,
  OsMetrics,
  ProcessMetrics,
  SystemMetrics,
} from './metrics.interface';

@Injectable()
export class MetricsService {
  constructor(
    @Inject(CUSTOM_METRICS) private readonly customMetrics: CustomMetricDefinition[],
  ) {}

  private previousCpuTimes: { idle: number; total: number } | null = null;

  async collectSystem(): Promise<SystemMetrics> {
    return {
      cpu: await this.collectCpu(),
      memory: this.collectMemory(),
      process: this.collectProcess(),
      os: this.collectOs(),
    };
  }

  async collectCustom(): Promise<Record<string, number>> {
    const result: Record<string, number> = {};
    for (const metric of this.customMetrics) {
      try {
        result[metric.name] = await metric.collect();
      } catch {
        result[metric.name] = -1;
      }
    }
    return result;
  }

  private async collectCpu(): Promise<CpuMetrics> {
    const loads = os.loadavg();

    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    }

    let usage = 0;
    if (this.previousCpuTimes) {
      const idleDelta = totalIdle - this.previousCpuTimes.idle;
      const totalDelta = totalTick - this.previousCpuTimes.total;
      usage = totalDelta > 0 ? 100 - (idleDelta / totalDelta) * 100 : 0;
    }

    this.previousCpuTimes = { idle: totalIdle, total: totalTick };

    return {
      usage: Math.round(usage * 10) / 10,
      loads: [loads[0], loads[1], loads[2]],
    };
  }

  private collectMemory(): MemoryMetrics {
    const total = os.totalmem();
    const free = os.freemem();
    const heap = process.memoryUsage();

    return {
      total,
      free,
      used: total - free,
      heapUsed: heap.heapUsed,
      heapTotal: heap.heapTotal,
    };
  }

  private collectProcess(): ProcessMetrics {
    return {
      uptime: process.uptime(),
      pid: process.pid,
      nodeVersion: process.version,
    };
  }

  private collectOs(): OsMetrics {
    return {
      hostname: os.hostname(),
      platform: os.platform(),
      uptime: os.uptime(),
    };
  }
}
