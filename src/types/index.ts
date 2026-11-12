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

export interface Work4Category {
  code: string;
  rpt_prefix: string;
  name: string;
  form_type: string;
  status: 'FOUND' | 'SKIPPED_EMPTY' | 'ERROR';
  record_count: number;
  pdf_pages: number;
  mock_preview_url?: string | null;
  error_code?: string;
}

export interface Work4PrinterStatus {
  host: string;
  printer_name: string;
  is_ready: boolean;
  message: string;
}

export interface Work4StatusResponse {
  mode: 'OFFLINE_MOCK' | 'CMS2_LIVE';
  task_id: string;
  selected_year: string;
  selected_month: string;
  month_label: string;
  printer_status: Work4PrinterStatus;
  categories: Work4Category[];
}

export interface Work4PreviewRequest {
  year: string;
  month: string;
  category_code: string;
  margin_top_mm: number;
  margin_left_mm: number;
}

export interface Work4PreviewResponse {
  status: 'PREVIEW_READY' | 'ERROR';
  page_size: string;
  total_pages: number;
  pdf_blob_url: string;
  message?: string;
}

export interface Work4PrintRequest {
  job_id: string;
  idempotency_key: string;
  category_code: string;
  confirmed_by_owner: boolean;
}

export interface Work4PrintResponse {
  job_id: string;
  status: 'QUEUED' | 'BLOCKED_CMS2_OFFLINE' | 'ERROR' | 'DUPLICATE_IGNORED';
  spooler_state?: string;
  message?: string;
}

