export interface HealthCheck {
  name: string;
  check: () => Promise<boolean> | boolean;
}

export interface HealthCheckResult {
  name: string;
  status: 'up' | 'down';
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  uptime: number;
  timestamp: string;
  checks: HealthCheckResult[];
}
