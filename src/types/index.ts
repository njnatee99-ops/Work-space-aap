export interface GatewayConfig {
  baseUrl: string;
  webhookEndpoint: string;
  apiKey: string;
  isSimulationMode: boolean;
  status: 'connected' | 'testing' | 'offline' | 'simulated';
  latencyMs: number;
  lastPing?: string;
}

export interface PayloadLog {
  id: string;
  timestamp: string;
  action: string;
  method: 'POST' | 'GET';
  endpoint: string;
  headers: Record<string, string>;
  payload: Record<string, unknown>;
  status: number;
  latencyMs: number;
  response: Record<string, unknown>;
  isSimulated: boolean;
}

export interface ScopeItem {
  id: string;
  title: string;
  gate: string;
  rule: string;
  status: string;
  updatedAt: string;
}

export interface StopGateItem {
  code: string;
  name: string;
  status: 'PASS' | 'PENDING' | 'SCANNING';
  detail: string;
  category: string;
}
