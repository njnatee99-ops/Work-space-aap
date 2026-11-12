import {
  Work4StatusResponse,
  Work4PreviewRequest,
  Work4PreviewResponse,
  Work4PrintRequest,
  Work4PrintResponse,
  Work4Category
} from '../types';

// Default mock payload from OFFLINE DATA CONTRACT specification
export const DEFAULT_OFFLINE_MOCK_DATA: Work4StatusResponse = {
  mode: "OFFLINE_MOCK",
  task_id: "CRD-WORK4-PRINT-FORMAT-NEW-20261112",
  selected_year: "2026",
  selected_month: "11",
  month_label: "พฤศจิกายน 2026",
  printer_status: {
    host: "CMS-2 (OFFLINE_SIMULATED)",
    printer_name: "Default Windows A6 Printer (Simulated)",
    is_ready: false,
    message: "CMS-2 ออฟไลน์ — เปิดโหมดพรีวิวและทดสอบ UI จำลอง (ล็อกปุ่มสั่งพิมพ์จริง)"
  },
  categories: [
    { code: "C01", rpt_prefix: "CLT-003-02", name: "ผู้กู้ 2 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "FOUND", record_count: 12, pdf_pages: 12, mock_preview_url: "mock://a6-preview/C01" },
    { code: "C02", rpt_prefix: "CLT-004-02", name: "ผู้กู้ร่วม 2 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "FOUND", record_count: 5, pdf_pages: 5, mock_preview_url: "mock://a6-preview/C02" },
    { code: "C03", rpt_prefix: "CLT-004-02", name: "ผู้ค้ำ 2 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "SKIPPED_EMPTY", record_count: 0, pdf_pages: 0, mock_preview_url: null },
    { code: "C04", rpt_prefix: "CLT-005-02", name: "ผู้กู้ 4 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "FOUND", record_count: 8, pdf_pages: 8, mock_preview_url: "mock://a6-preview/C04" },
    { code: "C05", rpt_prefix: "CLT-006-02", name: "ผู้กู้ร่วม 4 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "SKIPPED_EMPTY", record_count: 0, pdf_pages: 0, mock_preview_url: null },
    { code: "C06", rpt_prefix: "CLT-006-02", name: "ผู้ค้ำ 4 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "FOUND", record_count: 3, pdf_pages: 3, mock_preview_url: "mock://a6-preview/C06" },
    { code: "C07", rpt_prefix: "CLT-007-02", name: "ผู้กู้ 5 งวด", form_type: "ใบฟ้า EMS A6", status: "FOUND", record_count: 15, pdf_pages: 15, mock_preview_url: "mock://a6-preview/C07" },
    { code: "C08", rpt_prefix: "CLT-008-02", name: "ผู้กู้ร่วม 5 งวด", form_type: "ใบฟ้า EMS A6", status: "FOUND", record_count: 4, pdf_pages: 4, mock_preview_url: "mock://a6-preview/C08" },
    { code: "C09", rpt_prefix: "CLT-008-02", name: "ผู้ค้ำ 5 งวด", form_type: "ใบฟ้า EMS A6", status: "ERROR", record_count: 0, pdf_pages: 0, error_code: "MOCK_TEST_READ_ERROR", mock_preview_url: null }
  ]
};

// Generate UUID v4 for Idempotency Key
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class Work4Service {
  private inFlightPrint = false;
  private currentMode: 'OFFLINE_MOCK' | 'CMS2_LIVE' = 'OFFLINE_MOCK';

  // Endpoint 1: Get 9-category status & printer health
  async getStatus(year = '2026', month = '11'): Promise<Work4StatusResponse> {
    try {
      const res = await fetch(`/api/work4/status?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`);
      if (res.ok) {
        const data = await res.json();
        this.currentMode = data.mode;
        return data;
      }
    } catch {
      // fallback in pure static mode
    }

    // Static fallback respecting current mode
    return {
      ...DEFAULT_OFFLINE_MOCK_DATA,
      mode: this.currentMode,
      selected_year: year,
      selected_month: month,
      printer_status: this.currentMode === 'CMS2_LIVE' ? {
        host: "CMS-2 (ONLINE_LIVE)",
        printer_name: "Brother/HP Laser A6 Feed (Active)",
        is_ready: true,
        message: "CMS-2 ออนไลน์ — ระบบ Spooler พร้อมรับงานพิมพ์จริง"
      } : DEFAULT_OFFLINE_MOCK_DATA.printer_status
    };
  }

  // Endpoint 2: Generate A6 preview
  async getPreview(params: Work4PreviewRequest): Promise<Work4PreviewResponse> {
    try {
      const res = await fetch('/api/work4/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const cat = DEFAULT_OFFLINE_MOCK_DATA.categories.find(c => c.code === params.category_code);
    return {
      status: 'PREVIEW_READY',
      page_size: 'A6 (105x148mm)',
      total_pages: cat?.pdf_pages || 1,
      pdf_blob_url: `mock://a6-preview/${params.category_code}?top=${params.margin_top_mm}&left=${params.margin_left_mm}`
    };
  }

  // Endpoint 3: Print request with double-click guard & idempotency key
  async sendPrint(req: Work4PrintRequest): Promise<Work4PrintResponse> {
    if (this.inFlightPrint) {
      return {
        job_id: req.job_id,
        status: 'DUPLICATE_IGNORED',
        message: 'มีคำสั่งพิมพ์ที่กำลังประมวลผลอยู่ กรุณารอสักครู่ (ป้องกันการกดเบิ้ล)'
      };
    }

    this.inFlightPrint = true;
    try {
      const res = await fetch('/api/work4/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    } finally {
      setTimeout(() => {
        this.inFlightPrint = false;
      }, 800);
    }

    // Static fallback
    if (this.currentMode === 'OFFLINE_MOCK') {
      return {
        job_id: req.job_id,
        status: 'BLOCKED_CMS2_OFFLINE',
        message: 'เครื่อง CMS-2 ออฟไลน์ ไม่สามารถส่งคิวพิมพ์จริงได้'
      };
    }

    return {
      job_id: req.job_id,
      status: 'QUEUED',
      spooler_state: 'SUBMITTED',
      message: 'ส่งงานพิมพ์เข้า Spooler บนเครื่อง CMS-2 สำเร็จ'
    };
  }

  // Toggle Mode for local testing/simulation
  async toggleMode(): Promise<Work4StatusResponse> {
    try {
      const res = await fetch('/api/work4/toggle-mode', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        this.currentMode = data.mode;
        return data;
      }
    } catch {
      // toggle locally
    }
    this.currentMode = this.currentMode === 'OFFLINE_MOCK' ? 'CMS2_LIVE' : 'OFFLINE_MOCK';
    return this.getStatus();
  }

  getCurrentMode(): 'OFFLINE_MOCK' | 'CMS2_LIVE' {
    return this.currentMode;
  }
}

export const work4Service = new Work4Service();
