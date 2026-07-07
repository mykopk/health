export interface HealthCheckDetail {
  [key: string]: unknown;
}

export interface HealthCheckResult {
  name: string;
  status: 'up' | 'down';
  detail?: HealthCheckDetail;
}

export type HealthCheckReturn = boolean | { status: boolean; detail?: HealthCheckDetail };

export interface HealthCheck {
  name: string;
  check: () => Promise<HealthCheckReturn> | HealthCheckReturn;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  uptime: number;
  timestamp: string;
  checks: HealthCheckResult[];
}
