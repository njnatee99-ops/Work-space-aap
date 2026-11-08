import { GatewayConfig, PayloadLog } from '../types';

const STORAGE_KEY_CONFIG = 'nexus_gateway_config';
const STORAGE_KEY_LOGS = 'nexus_gateway_logs';

type GatewayListener = (config: GatewayConfig) => void;
type LogListener = (logs: PayloadLog[]) => void;

class BackendGatewayService {
  private config: GatewayConfig;
  private logs: PayloadLog[] = [];
  private configListeners: Set<GatewayListener> = new Set();
  private logListeners: Set<LogListener> = new Set();

  constructor() {
    this.config = this.loadConfig();
    this.logs = this.loadLogs();
  }

  private loadConfig(): GatewayConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }

    return {
      baseUrl: 'https://api.nexusledger.io/v1',
      webhookEndpoint: '/webhooks/contract-dispatch',
      apiKey: 'nk_live_920f83ba7c1e4d',
      isSimulationMode: true,
      status: 'simulated',
      latencyMs: 14,
      lastPing: new Date().toLocaleTimeString('th-TH'),
    };
  }

  private loadLogs(): PayloadLog[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }

    // Default sample initial log
    return [
      {
        id: 'log_init_01',
        timestamp: new Date(Date.now() - 360000).toLocaleTimeString('th-TH'),
        action: 'system.node_handshake',
        method: 'POST',
        endpoint: '/webhooks/contract-dispatch',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer nk_live_••••••',
        },
        payload: {
          event: 'GATEWAY_HEALTH_PROBE',
          nodeId: 'nexus-edge-asia-bkk',
          activeGates: 16,
          ledgerBlock: 849201,
        },
        status: 200,
        latencyMs: 12,
        response: {
          status: 'HEALTHY',
          dualKeyLedger: 'SYNCED',
          message: 'Dual-key cryptographic ledger ready for contract ingestion',
        },
        isSimulated: true,
      },
    ];
  }

  public getConfig(): GatewayConfig {
    return { ...this.config };
  }

  public getLogs(): PayloadLog[] {
    return [...this.logs];
  }

  public updateConfig(newConfig: Partial<GatewayConfig>): GatewayConfig {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(this.config));
    } catch {
      // localstorage full or restricted
    }
    this.notifyConfig();
    return this.getConfig();
  }

  public onConfigChange(listener: GatewayListener): () => void {
    this.configListeners.add(listener);
    return () => this.configListeners.delete(listener);
  }

  public onLog(listener: LogListener): () => void {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  private notifyConfig() {
    for (const listener of this.configListeners) {
      listener(this.getConfig());
    }
  }

  private notifyLogs() {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.logs.slice(0, 50)));
    } catch {
      // ignore
    }
    for (const listener of this.logListeners) {
      listener(this.getLogs());
    }
  }

  public async testConnection(): Promise<{ success: boolean; latencyMs: number; status: number; message: string }> {
    this.updateConfig({ status: 'testing' });
    const startTime = performance.now();

    if (this.config.isSimulationMode || !this.config.baseUrl) {
      // Simulate connection
      await new Promise((r) => setTimeout(r, 140));
      const latencyMs = Math.round(performance.now() - startTime);
      this.updateConfig({
        status: 'simulated',
        latencyMs,
        lastPing: new Date().toLocaleTimeString('th-TH'),
      });
      return {
        success: true,
        latencyMs,
        status: 200,
        message: 'โหมดจำลองสถานการณ์ (Built-in Simulator) ตอบสนองปกติ',
      };
    }

    try {
      const url = `${this.config.baseUrl.replace(/\/$/, '')}/health`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/json',
        },
      });

      const latencyMs = Math.round(performance.now() - startTime);
      const isSuccess = res.ok;

      this.updateConfig({
        status: isSuccess ? 'connected' : 'offline',
        latencyMs,
        lastPing: new Date().toLocaleTimeString('th-TH'),
      });

      return {
        success: isSuccess,
        latencyMs,
        status: res.status,
        message: isSuccess ? 'เชื่อมต่อเซิร์ฟเวอร์หลังบ้านสำเร็จ' : `เซิร์ฟเวอร์ตอบกลับรหัส ${res.status}`,
      };
    } catch (err: unknown) {
      const latencyMs = Math.round(performance.now() - startTime);
      this.updateConfig({
        status: 'offline',
        latencyMs,
        lastPing: new Date().toLocaleTimeString('th-TH'),
      });

      return {
        success: false,
        latencyMs,
        status: 0,
        message: err instanceof Error ? err.message : 'ไม่สามารถเชื่อมต่อปลายทางได้ (โปรดตรวจสอบ CORS หรือ URL)',
      };
    }
  }

  public async dispatchAction(
    action: string,
    payload: Record<string, unknown>,
    overrideEndpoint?: string
  ): Promise<{ success: boolean; log: PayloadLog }> {
    const startTime = performance.now();
    const endpoint = overrideEndpoint || this.config.webhookEndpoint;
    const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = new Date().toLocaleTimeString('th-TH');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Nexus-Action': action,
      'X-Timestamp': new Date().toISOString(),
      'Authorization': this.config.apiKey
        ? `Bearer ${this.config.apiKey.substring(0, 7)}••••••••`
        : 'Bearer (none)',
    };

    // If simulated or no real base URL
    if (this.config.isSimulationMode || !this.config.baseUrl.startsWith('http')) {
      await new Promise((r) => setTimeout(r, 110 + Math.random() * 60));
      const latencyMs = Math.round(performance.now() - startTime);

      const simulatedResponse: Record<string, unknown> = {
        ack: true,
        eventId: `evt_${Math.random().toString(36).substring(2, 10)}`,
        actionReceived: action,
        processedAt: new Date().toISOString(),
        executionGateway: 'Nexus-Internal-Simulator-v2',
        status: 'DISPATCH_COMMITTED',
        ledgerTxHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      };

      const newLog: PayloadLog = {
        id: logId,
        timestamp,
        action,
        method: 'POST',
        endpoint,
        headers,
        payload,
        status: 200,
        latencyMs,
        response: simulatedResponse,
        isSimulated: true,
      };

      this.logs = [newLog, ...this.logs.slice(0, 49)];
      this.notifyLogs();
      this.updateConfig({ latencyMs, lastPing: timestamp });

      return { success: true, log: newLog };
    }

    // Direct HTTP Dispatch to User Backend
    const targetUrl = `${this.config.baseUrl.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Nexus-Action': action,
        },
        body: JSON.stringify(payload),
      });

      const latencyMs = Math.round(performance.now() - startTime);
      let responseBody: Record<string, unknown> = {};

      try {
        responseBody = await response.json();
      } catch {
        responseBody = { rawText: await response.text() };
      }

      const newLog: PayloadLog = {
        id: logId,
        timestamp,
        action,
        method: 'POST',
        endpoint: targetUrl,
        headers,
        payload,
        status: response.status,
        latencyMs,
        response: responseBody,
        isSimulated: false,
      };

      this.logs = [newLog, ...this.logs.slice(0, 49)];
      this.notifyLogs();
      this.updateConfig({ latencyMs, lastPing: timestamp });

      return { success: response.ok, log: newLog };
    } catch (err: unknown) {
      const latencyMs = Math.round(performance.now() - startTime);
      const errorMsg = err instanceof Error ? err.message : 'Unknown network failure';

      const errorLog: PayloadLog = {
        id: logId,
        timestamp,
        action,
        method: 'POST',
        endpoint: targetUrl,
        headers,
        payload,
        status: 504,
        latencyMs,
        response: {
          error: errorMsg,
          suggestion: 'เซิร์ฟเวอร์ปลายทางปฏิเสธการเชื่อมต่อหรือติดปัญหา CORS ให้เปิดโหมดจำลอง (Simulator) เพื่อทดสอบเวิร์กโฟลว์',
        },
        isSimulated: false,
      };

      this.logs = [errorLog, ...this.logs.slice(0, 49)];
      this.notifyLogs();
      this.updateConfig({ latencyMs, lastPing: timestamp, status: 'offline' });

      return { success: false, log: errorLog };
    }
  }

  public clearLogs() {
    this.logs = [];
    this.notifyLogs();
  }
}

export const backendGateway = new BackendGatewayService();
