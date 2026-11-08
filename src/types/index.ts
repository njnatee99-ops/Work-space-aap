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

export interface TicketForm {
  name: string;
  organization: string;
  email: string;
  contractVolume: string;
  message: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  isPopular?: boolean;
  badge?: string;
  features: string[];
  ctaLabel: string;
}
