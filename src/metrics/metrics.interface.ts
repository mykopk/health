export interface CpuMetrics {
  usage: number;
  loads: [number, number, number];
}

export interface MemoryMetrics {
  total: number;
  free: number;
  used: number;
  heapUsed: number;
  heapTotal: number;
}

export interface ProcessMetrics {
  uptime: number;
  pid: number;
  nodeVersion: string;
}

export interface OsMetrics {
  hostname: string;
  platform: string;
  uptime: number;
}

export interface SystemMetrics {
  cpu: CpuMetrics;
  memory: MemoryMetrics;
  process: ProcessMetrics;
  os: OsMetrics;
}

export interface CustomMetricDefinition {
  name: string;
  help: string;
  labelNames?: string[];
  collect: () => number | Record<string, number> | Promise<number> | Promise<Record<string, number>>;
}

export interface CustomMetricsCollection {
  [name: string]: number;
}

export interface MetricsResponse {
  system: SystemMetrics;
  custom: CustomMetricsCollection;
}
