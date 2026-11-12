import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API: AI Command Generator using Gemini Flash
app.post('/api/ai/generate-scope', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const cleanPrompt = String(prompt).trim();
      const fallbackResult = {
        id: `CRD-AI-${Math.floor(100 + Math.random() * 900)}`,
        title: cleanPrompt.length > 50 ? cleanPrompt.substring(0, 48) + '...' : cleanPrompt,
        gate: 'V003_FORMAT_ONLY',
        rule: `เงื่อนไขตามคำสั่ง "${cleanPrompt}" ควบคุมรูปแบบข้อมูลมาตรฐาน และ PDPA Zero-PII`,
        actionPrompt: `สร้างหน้าจอและฟังก์ชันสำหรับ: ${cleanPrompt}`,
      };
      return res.json({ success: true, result: fallbackResult, isFallback: true });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `คุณคือ AI สถาปัตยกรรมสัญญาอัจฉริยะและการขยายขอบเขตงานอัตโนมัติ (NexusLedger Architecture Engine)
ผู้ใช้ต้องการส่งคำสั่งเพื่อขยายขอบเขตงานหรือสร้างรูปแบบใหม่ในแอป:
"${prompt}"

โปรดสร้างสเปกโมดูลใหม่ที่สอดคล้องกับมาตรฐาน CRD, V003 (Format Control), และ PDPA Zero-PII ในรูปแบบ JSON:
- id: รหัสโมดูล เช่น CRD-AI-01 หรือ WORK-AI
- title: ชื่อขอบเขตงานภาษาไทยที่สั้น กระชับ ตรงประเด็น
- gate: ด่านควบคุมความปลอดภัย เลือกหนึ่งใน: DUAL_KEY_LEDGER, PDPA_ZERO_PII, V003_FORMAT_ONLY, AUTO_DRIVE_SYNC
- rule: กติกาและข้อกำหนดทางเทคนิคที่ห้ามเพี้ยน (ภาษาไทย)
- actionPrompt: ข้อความคำสั่งภาษาไทยที่สมบูรณ์สำหรับสั่งต่อให้ AI Studio สร้างโค้ดหน้าตา UI`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            gate: { type: Type.STRING },
            rule: { type: Type.STRING },
            actionPrompt: { type: Type.STRING },
          },
          required: ['id', 'title', 'gate', 'rule', 'actionPrompt'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, result: parsed, isFallback: false });
  } catch (err: any) {
    console.error('Gemini error:', err);
    const cleanPrompt = String(req.body?.prompt || 'คำสั่งขยายขอบเขตงานใหม่').trim();
    const fallbackResult = {
      id: `CRD-AI-${Math.floor(100 + Math.random() * 900)}`,
      title: cleanPrompt.length > 50 ? cleanPrompt.substring(0, 48) + '...' : cleanPrompt,
      gate: 'AUTO_DRIVE_SYNC',
      rule: `ขยายขอบเขตงานตามข้อกำหนด "${cleanPrompt}" และซิงก์ผลลัพธ์ลง 00_Project_Manifest.json`,
      actionPrompt: `สร้างฟังก์ชันและหน้าตาสำหรับ: ${cleanPrompt}`,
    };
    return res.json({ success: true, result: fallbackResult, errorNotice: err?.message, isFallback: true });
  }
});

// API: Codebase Introspection Reader
app.get('/api/ai/codebase-summary', (req, res) => {
  const codebaseInventory = {
    version: '2026.11.11-CRD-MOBILE',
    framework: 'React 19 + TypeScript + Vite + Tailwind CSS',
    gatewayUrl: 'https://script.google.com/macros/s/AKfycbwTEboyfHQ0LzmrP0mtxWCYtrg13Jz5JqKpLVW-8Dtf3bWYqoc-ZoPObtZGjSlKriBU/exec',
    targetWorkspaceFolderId: '1RvGehvlDrPTaR9JvQgCcFPqiQbRE8_yn',
    manifestFileName: '00_Project_Manifest.json',
    activeGatesCount: 16,
    coreGates: ['GATE-01: Leading Zero Guard', 'GATE-02: NewLoanID vs Loan_ID_Detial', 'GATE-03: PDPA Zero-PII', 'GATE-04: Drive Manifest Sync'],
    activeScopes: [
      'CRD-SCOPE-01: Dual-Key Ledger Ingestion',
      'CRD-SCOPE-02: V003 Format Control Gate',
      'CRD-SCOPE-03: WORK 1 & WORK 4 Automated Stop Gates',
      'CRD-SCOPE-04: Self-Expanding Drive Workspace'
    ],
    themeTokens: {
      light: { bg: '#F6F9FF', surface: '#FFFFFF', primary: '#1D4ED8', ink: '#14243A', border: '#DFE7F4' },
      dark: { bg: '#070B12', surface: '#0B101D', primary: '#2DD4BF', ink: '#F1F5F9', border: '#1E293B' }
    }
  };
  return res.json({ success: true, codebase: codebaseInventory });
});

// API: Self-Evolution Design Engine (Reads own code & designs new UI modules)
app.post('/api/ai/self-evolve-design', async (req, res) => {
  try {
    const { prompt, currentCodeContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const cleanPrompt = String(prompt).trim();

    if (!apiKey) {
      const fallbackDesign = {
        componentId: `UI-EVOLVE-${Math.floor(100 + Math.random() * 900)}`,
        title: cleanPrompt.length > 50 ? cleanPrompt.substring(0, 48) + '...' : cleanPrompt,
        category: 'DASHBOARD',
        summary: `โมดูลออกแบบอัตโนมัติตามข้อกำหนด "${cleanPrompt}" รองรับสถาปัตยกรรม Dual-Key และกติกา V003`,
        gate: 'V003_FORMAT_ONLY',
        rule: `ล็อกรูปแบบข้อมูล 5 หลัก, PDPA Zero-PII, และซิงก์อัปเดตลง 00_Project_Manifest.json`,
        actionPrompt: `สร้างคอมโพเนนต์และหน้าตา UI สำหรับ: ${cleanPrompt}`,
        uiPreviewData: {
          metrics: [
            { label: 'รายการตรวจสอบ', value: '1,420 สัญญา', change: '+12% จากสัปดาห์ก่อน' },
            { label: 'ความเร็วประมวลผล', value: '18ms', change: 'GAS Connected' },
            { label: 'ด่านที่ผ่าน (Pass)', value: '100%', change: 'Zero-PII Safe' }
          ],
          actions: ['สแกนข้อมูลชุดใหม่', 'คำนวณเบี้ยปรับ V003', 'ส่งออกรายงาน Drive'],
          primaryActionLabel: 'ประมวลผลคำสั่งในโมดูลนี้ทันที',
          demoDataRows: [
            { col1: '00142', col2: 'LN-2026-X89', col3: 'พม. 1 สัญญา', status: 'PASS' },
            { col1: '00398', col2: 'LN-2026-A12', col3: 'พม. + สัญญาอื่น', status: 'PASS' },
            { col1: '01024', col2: 'LN-2026-M44', col3: 'หนังสือแจ้งงวด 2', status: 'READY' }
          ]
        }
      };
      return res.json({ success: true, design: fallbackDesign, isFallback: true });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `คุณคือ AI สถาปนิกและนักออกแบบ UI อัตโนมัติ (NexusLedger Self-Evolving UI Engine)
ข้อมูลโค้ดระบบปัจจุบันที่กำลังรันอยู่:
- Workspace Drive Folder: 1RvGehvlDrPTaR9JvQgCcFPqiQbRE8_yn (AI_Project_Workspace)
- Target Manifest: 00_Project_Manifest.json
- กติกาหลัก: V003 Format Control, Dual-Key Ledger, 16 Stop Gates, PDPA Zero-PII
- สไตล์การออกแบบ: โทนขาว-น้ำเงินสุภาพ (Primary #1D4ED8, Surface #FFFFFF, Bg #F6F9FF) หรือ Dark Mode (#070B12)
- บริบทโค้ดเพิ่มเติม: ${currentCodeContext || 'NexusLedger React SPA + Apps Script Web App'}

ผู้ใช้ต้องการให้อ่านโค้ดของตัวเอง แล้วออกแบบส่วนติดต่อผู้ใช้ (UI Component / Design Module) เพิ่มเติมในแอป:
"${cleanPrompt}"

โปรดสร้างโครงสร้างดีไซน์และข้อมูลจำลองที่พร้อม Render บนหน้าจอจริงในรูปแบบ JSON:
- componentId: รหัสโมดูล เช่น UI-EVOLVE-01
- title: ชื่อโมดูลดีไซน์ภาษาไทย
- category: หนึ่งใน DASHBOARD, CALCULATOR, DOCUMENT_PRINTER, BRANCH_INTAKE, AUDIT_GATE
- summary: คำอธิบายการออกแบบและประโยชน์ต่อผู้ใช้ (ภาษาไทย)
- gate: ด่านความปลอดภัยที่กำกับ เช่น DUAL_KEY_LEDGER, V003_FORMAT_ONLY, PDPA_ZERO_PII, AUTO_DRIVE_SYNC
- rule: กติกาควบคุมทางเทคนิค (ภาษาไทย)
- actionPrompt: ข้อความคำสั่งภาษาไทยฉบับสมบูรณ์สำหรับ AI Studio
- uiPreviewData: ออบเจกต์ข้อมูลสำหรับเรนเดอร์ UI Preview แบบมีปฏิสัมพันธ์จริง
  - metrics: อาเรย์ของ { label, value, change } (3 รายการ)
  - actions: อาเรย์ปุ่มคำสั่งย่อยในโมดูล (2-3 ปุ่ม)
  - primaryActionLabel: ข้อความบนปุ่มหลักของโมดูล
  - demoDataRows: อาเรย์ข้อมูลตัวอย่าง 3 แถว { col1, col2, col3, status }`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            componentId: { type: Type.STRING },
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            summary: { type: Type.STRING },
            gate: { type: Type.STRING },
            rule: { type: Type.STRING },
            actionPrompt: { type: Type.STRING },
            uiPreviewData: {
              type: Type.OBJECT,
              properties: {
                metrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.STRING },
                      change: { type: Type.STRING },
                    },
                    required: ['label', 'value'],
                  },
                },
                actions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                primaryActionLabel: { type: Type.STRING },
                demoDataRows: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      col1: { type: Type.STRING },
                      col2: { type: Type.STRING },
                      col3: { type: Type.STRING },
                      status: { type: Type.STRING },
                    },
                    required: ['col1', 'col2', 'col3', 'status'],
                  },
                },
              },
              required: ['metrics', 'actions', 'primaryActionLabel', 'demoDataRows'],
            },
          },
          required: ['componentId', 'title', 'category', 'summary', 'gate', 'rule', 'actionPrompt', 'uiPreviewData'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, design: parsed, isFallback: false });
  } catch (err: any) {
    console.error('Self-evolve error:', err);
    const cleanPrompt = String(req.body?.prompt || 'โมดูลส่วนติดต่อผู้ใช้ใหม่').trim();
    const fallbackDesign = {
      componentId: `UI-EVOLVE-${Math.floor(100 + Math.random() * 900)}`,
      title: cleanPrompt.length > 50 ? cleanPrompt.substring(0, 48) + '...' : cleanPrompt,
      category: 'DASHBOARD',
      summary: `โมดูลออกแบบอัตโนมัติตามข้อกำหนด "${cleanPrompt}" เชื่อมต่อตรงกับระบบ NexusLedger`,
      gate: 'AUTO_DRIVE_SYNC',
      rule: `บันทึกสเปกลง 00_Project_Manifest.json และรักษาความปลอดภัย Zero-PII`,
      actionPrompt: `สร้างฟังก์ชันและคอมโพเนนต์สำหรับ: ${cleanPrompt}`,
      uiPreviewData: {
        metrics: [
          { label: 'สัญญาทั้งหมด', value: '2,580 สัญญา', change: 'อัปเดตอัตโนมัติ' },
          { label: 'ความหน่วงระบบ', value: '18ms', change: 'Apps Script' },
          { label: 'สถานะด่านตรวจ', value: '16 / 16 ผ่าน', change: 'V003 Safe' }
        ],
        actions: ['ตรวจคีย์สัญญา', 'สแกน 5 หลัก', 'ส่งออก Drive'],
        primaryActionLabel: 'เริ่มรันการประมวลผลโมดูลนี้',
        demoDataRows: [
          { col1: '00551', col2: 'LN-V003-99', col3: 'สาขาภาคเหนือ', status: 'PASS' },
          { col1: '00782', col2: 'LN-V003-01', col3: 'สาขาภาคใต้', status: 'PASS' },
          { col1: '01290', col2: 'LN-V003-14', col3: 'สำนักงานใหญ่', status: 'PASS' }
        ]
      }
    };
    return res.json({ success: true, design: fallbackDesign, errorNotice: err?.message, isFallback: true });
  }
});

// WORK 4: NexusLedger / CRD-Web OFFLINE DATA CONTRACT API
// ==========================================

let work4Mode: 'OFFLINE_MOCK' | 'CMS2_LIVE' = 'OFFLINE_MOCK';
const idempotencyStore = new Map<string, { timestamp: number; response: any }>();

const WORK4_STANDARD_CATEGORIES = [
  { code: "C01", rpt_prefix: "CLT-003-02", name: "ผู้กู้ 2 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "FOUND", record_count: 12, pdf_pages: 12, mock_preview_url: "mock://a6-preview/C01" },
  { code: "C02", rpt_prefix: "CLT-004-02", name: "ผู้กู้ร่วม 2 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "FOUND", record_count: 5, pdf_pages: 5, mock_preview_url: "mock://a6-preview/C02" },
  { code: "C03", rpt_prefix: "CLT-004-02", name: "ผู้ค้ำ 2 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "SKIPPED_EMPTY", record_count: 0, pdf_pages: 0, mock_preview_url: null },
  { code: "C04", rpt_prefix: "CLT-005-02", name: "ผู้กู้ 4 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "FOUND", record_count: 8, pdf_pages: 8, mock_preview_url: "mock://a6-preview/C04" },
  { code: "C05", rpt_prefix: "CLT-006-02", name: "ผู้กู้ร่วม 4 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "SKIPPED_EMPTY", record_count: 0, pdf_pages: 0, mock_preview_url: null },
  { code: "C06", rpt_prefix: "CLT-006-02", name: "ผู้ค้ำ 4 งวด", form_type: "ก.2/ค.2 + EMS A6", status: "FOUND", record_count: 3, pdf_pages: 3, mock_preview_url: "mock://a6-preview/C06" },
  { code: "C07", rpt_prefix: "CLT-007-02", name: "ผู้กู้ 5 งวด", form_type: "ใบฟ้า EMS A6", status: "FOUND", record_count: 15, pdf_pages: 15, mock_preview_url: "mock://a6-preview/C07" },
  { code: "C08", rpt_prefix: "CLT-008-02", name: "ผู้กู้ร่วม 5 งวด", form_type: "ใบฟ้า EMS A6", status: "FOUND", record_count: 4, pdf_pages: 4, mock_preview_url: "mock://a6-preview/C08" },
  { code: "C09", rpt_prefix: "CLT-008-02", name: "ผู้ค้ำ 5 งวด", form_type: "ใบฟ้า EMS A6", status: "ERROR", record_count: 0, pdf_pages: 0, error_code: "MOCK_TEST_READ_ERROR", mock_preview_url: null }
];

// Endpoint 1: GET /api/work4/status?year=2026&month=11
app.get('/api/work4/status', (req, res) => {
  const year = String(req.query.year || '2026');
  const month = String(req.query.month || '11');
  const monthNames: Record<string, string> = {
    '01': 'มกราคม', '02': 'กุมภาพันธ์', '03': 'มีนาคม', '04': 'เมษายน',
    '05': 'พฤษภาคม', '06': 'มิถุนายน', '07': 'กรกฎาคม', '08': 'สิงหาคม',
    '09': 'กันยายน', '10': 'ตุลาคม', '11': 'พฤศจิกายน', '12': 'ธันวาคม'
  };
  const paddedMonth = month.padStart(2, '0');
  const monthLabel = `${monthNames[paddedMonth] || 'พฤศจิกายน'} ${year}`;

  const printerStatus = work4Mode === 'OFFLINE_MOCK' ? {
    host: "CMS-2 (OFFLINE_SIMULATED)",
    printer_name: "Default Windows A6 Printer (Simulated)",
    is_ready: false,
    message: "CMS-2 ออฟไลน์ — เปิดโหมดพรีวิวและทดสอบ UI จำลอง (ล็อกปุ่มสั่งพิมพ์จริง)"
  } : {
    host: "CMS-2 (ONLINE_LIVE)",
    printer_name: "Brother/HP Laser A6 (Windows Spooler Active)",
    is_ready: true,
    message: "CMS-2 ออนไลน์ — ระบบ Spooler พร้อมรับคิวพิมพ์จริงทันที"
  };

  return res.json({
    mode: work4Mode,
    task_id: "CRD-WORK4-PRINT-FORMAT-NEW-20261112",
    selected_year: year,
    selected_month: month,
    month_label: monthLabel,
    printer_status: printerStatus,
    categories: WORK4_STANDARD_CATEGORIES
  });
});

// Endpoint 2: POST /api/work4/preview
app.post('/api/work4/preview', (req, res) => {
  const { year, month, category_code, margin_top_mm = 0, margin_left_mm = 0 } = req.body;
  const cat = WORK4_STANDARD_CATEGORIES.find(c => c.code === category_code);
  if (!cat) {
    return res.status(404).json({ status: 'ERROR', message: `Category ${category_code} not found` });
  }

  const totalPages = cat.pdf_pages || 1;
  return res.json({
    status: "PREVIEW_READY",
    page_size: "A6 (105x148mm)",
    total_pages: totalPages,
    pdf_blob_url: `blob://nexusledger/a6/${category_code}?year=${year}&month=${month}&top=${margin_top_mm}&left=${margin_left_mm}`,
    category_name: cat.name,
    form_type: cat.form_type,
    margin_top_mm,
    margin_left_mm
  });
});

// Endpoint 3: POST /api/work4/print (Idempotency Key guarded)
app.post('/api/work4/print', (req, res) => {
  const { job_id, idempotency_key, category_code, confirmed_by_owner } = req.body;
  if (!idempotency_key) {
    return res.status(400).json({ error: 'idempotency_key is required to prevent double-click duplicate prints' });
  }

  // Check Idempotency Cache (within 60s window)
  const now = Date.now();
  if (idempotencyStore.has(idempotency_key)) {
    const cached = idempotencyStore.get(idempotency_key)!;
    if (now - cached.timestamp < 60000) {
      return res.json({
        ...cached.response,
        idempotent_replay: true,
        message: 'ตรวจพบคำสั่งพิมพ์ซ้ำ (Idempotency Key ซ้ำ) — ระบบป้องกันการกดเบิ้ลสำเร็จ'
      });
    }
  }

  let responsePayload: any;
  if (work4Mode === 'OFFLINE_MOCK') {
    responsePayload = {
      job_id: job_id || `JOB-${Date.now()}`,
      status: "BLOCKED_CMS2_OFFLINE",
      message: "เครื่อง CMS-2 ออฟไลน์ ไม่สามารถส่งคิวพิมพ์จริงได้"
    };
  } else {
    responsePayload = {
      job_id: job_id || `JOB-${Date.now()}`,
      status: "QUEUED",
      spooler_state: "SUBMITTED",
      message: "ส่งงานพิมพ์ออกเครื่องพิมพ์ Windows A6 สำเร็จ"
    };
  }

  idempotencyStore.set(idempotency_key, { timestamp: now, response: responsePayload });
  return res.json(responsePayload);
});

// Helper Endpoint: POST /api/work4/toggle-mode
app.post('/api/work4/toggle-mode', (req, res) => {
  work4Mode = work4Mode === 'OFFLINE_MOCK' ? 'CMS2_LIVE' : 'OFFLINE_MOCK';
  const printerStatus = work4Mode === 'OFFLINE_MOCK' ? {
    host: "CMS-2 (OFFLINE_SIMULATED)",
    printer_name: "Default Windows A6 Printer (Simulated)",
    is_ready: false,
    message: "CMS-2 ออฟไลน์ — เปิดโหมดพรีวิวและทดสอบ UI จำลอง (ล็อกปุ่มสั่งพิมพ์จริง)"
  } : {
    host: "CMS-2 (ONLINE_LIVE)",
    printer_name: "Brother/HP Laser A6 (Windows Spooler Active)",
    is_ready: true,
    message: "CMS-2 ออนไลน์ — ระบบ Spooler พร้อมรับคิวพิมพ์จริงทันที"
  };

  return res.json({
    mode: work4Mode,
    task_id: "CRD-WORK4-PRINT-FORMAT-NEW-20261112",
    selected_year: "2026",
    selected_month: "11",
    month_label: "พฤศจิกายน 2026",
    printer_status: printerStatus,
    categories: WORK4_STANDARD_CATEGORIES
  });
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
