# Enterprise Dark Mode Platform & User Backend Gateway

A high-performance, professional Dark Mode enterprise platform built for smart contract governance and ledger operations. Combines an interactive procedural Three.js 3D cryptographic core in the hero section, an asymmetric 4-card Bento grid, a 3-tier pricing matrix with annual discount toggle, a real-time validated enterprise contact form with instant Ticket ID generation, bespoke high-impact cyan primary buttons, and an interactive User Backend Gateway enabling live payload dispatch to custom user endpoints or a built-in simulation engine.

## User Review & Critical Decisions

> [!IMPORTANT]
> The clarifying questions were skipped by the user, so the recommended design and technical defaults have been selected:
> - **3D Visual Subject**: An interactive procedural 3D cybernetic cryptographic ledger node and polyhedral core (assembled from 7 distinct geometric parts with smooth exponential damping, metallic/transmissive PBR materials, procedural canvas textures, and a collapsible bottom inspection dock).
> - **Backend Gateway Execution**: Dual-mode engine featuring both a direct HTTP dispatch to the user's custom Base URL / Webhook / API Key and a built-in interactive simulator with live payload inspection and response latency telemetry.
> - **Language & Presentation**: High-contrast modern Thai interface paired with standard enterprise technical terms for maximum clarity and professionalism.

- **Confirmed Decision 1**: Modern dark mode aesthetic using an obsidian/deep slate canvas (`#080C14` / `#0F172A`), electric cyan accents (`#06B6D4`), and crisp white high-contrast headings with zero unstyled pill clutter.
- **Confirmed Decision 2**: User Backend Gateway persists custom settings (`baseUrl`, `webhookPath`, `apiKey`, `mockMode`) in `localStorage` and exposes a live drawer showing outbound JSON payloads, HTTP headers, response latency, and status codes for every primary action.

---

## 1. Overview & Core Concept

- **What It Does**: Provides an enterprise-grade landing and management portal for contract ingestion, compliance stop-gate verification, and webhook orchestration. Allows tech leads and enterprise users to connect their own backend endpoints (Base URL, Webhooks, API keys) or simulate requests with real-time feedback.
- **Target Audience / Persona**: Enterprise CTOs, smart contract engineers, compliance officers, and backend developers requiring robust audit trails and automated ledger ingestion.
- **Key Value**: Bridges marketing presentation with real technical utility—users can immediately test real webhook deliveries, audit stop gates, generate support tickets with tracking IDs, and configure backend endpoints on the fly.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Hero & 3D Immersion**:
   - User arrives at the dark-mode landing viewport, greeting them with high-contrast Thai/EN headlines, real-time backend connection status indicator in the top sub-bar, and live ledger throughput metrics.
   - User interacts with the Three.js 3D Cryptographic Node (rotate, zoom, inspect wireframe/cryptographic rings), or uses the collapsible bottom dock to toggle exploded layers and animation speeds.
2. **Bento Grid Exploration (01–04)**:
   - User navigates through 4 asymmetric cards featuring live interactive mini-demonstrations: Dual-Key Ledger Ingestion simulator, 16 Stop Gates compliance matrix, Contract Timeline DAG, and Webhook Dispatch queue.
3. **Plan Evaluation & Billing Toggle**:
   - User toggles between Monthly and Annual billing (displaying an instant 20% discount calculation).
   - Clicking "เริ่มต้นใช้งาน" (Get Started) or "เลือกแพ็กเกจนี้" on the prominent cyan-bordered Professional plan triggers an instant plan selection payload dispatch to the User Backend Gateway with visual confirmation.
4. **Interactive Lead Capture & Ticket Issuance**:
   - User enters details in the Dark Mode Contact Form (Name, Organization, Email, Contract Volume, Message).
   - Real-time client validation provides immediate feedback.
   - Upon submission, an algorithmic Ticket ID (e.g., `TKT-2026-X89B`) is issued, and the inquiry payload is dispatched directly to the configured webhook.
5. **Backend Gateway Configuration**:
   - User opens the Gateway Settings modal via the top bar status badge or floating action button.
   - User can input their own `Base URL`, `Webhook Path`, and `API Secret Key`, or toggle the interactive mock simulator.
   - A built-in "Test Connection" ping sends an automated health check and logs response latency.

### Visual Identity & Theme

- **Aesthetic Direction**: High-tech enterprise dark mode, cryptographic elegance, deep contrast, clean spatial rhythm, anti-slop typography.
- **Color Palette**:
  - Dominant Neutral Canvas (60%): Obsidian Black (`#080C14`) and Deep Slate (`#0B1120`).
  - Structural Surfaces (30%): Muted Card Surfaces (`#111827`), hairline borders (`rgba(255, 255, 255, 0.08)` and `rgba(6, 182, 212, 0.2)`).
  - High-Intent Accent Budget (10%): Electric Cyan (`#06B6D4` / `#22D3EE`), Emerald Green (`#10B981` for verified states), and Amber (`#F59E0B` for pending gates).
- **Typography & Hierarchy**:
  - Display Font: `Plus Jakarta Sans` / Neo-Grotesque with tight tracking and balanced headline wrap.
  - Body Copy: Crisp, high-legibility Thai & English typography (`text-slate-300`, `leading-relaxed`).
  - Data & Metrics: Monospace tabular numerals (`font-mono tabular-nums`).
- **HighImpactPrimaryButton**:
  - Deep rounded corners (`rounded-2xl`).
  - Multi-stop cyan/teal gradient (`bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500`).
  - Multi-tier deep drop shadow (`shadow-[0_10px_25px_-5px_rgba(6,182,212,0.45),0_0_15px_rgba(6,182,212,0.25)]`).
  - Subtle top-edge glass light catch (`after:absolute after:inset-x-0 after:top-0 after:h-[1px] after:bg-white/40`).
  - Press compression animation (`active:scale-[0.97] transition-all duration-150`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Backend Gateway with Direct HTTP & Simulation Fallback**
  - *Chosen Approach*: Allow users to enter any real external URL (CORS-enabled or server proxy) while providing an instant interactive simulator with real network delay simulation, realistic status codes (200 OK / 201 Created), and a live payload inspector drawer.
  - *Why*: Eliminates friction if the user hasn't deployed their backend yet, while providing 100% real dispatch capabilities if they enter an active endpoint.
  - *Alternatives Considered*: Rigid mock-only (violates user request for real backend gateway) or raw unhandled fetch (would throw broken CORS errors if endpoint isn't ready).
- **Decision 2: Procedural 3D Three.js Ledger Subject (Zero 404s)**
  - *Chosen Approach*: Construct a 7-part procedural composite model (`THREE.Group`) containing a beveled central cryptographic core, dual counter-rotating gimbal rings, 8 orbiting node crystals, contact shadow plane, and dynamic soft lighting rig.
  - *Why*: Guarantees 60fps performance across desktop and mobile with zero missing asset errors or external texture dependencies.
  - *Alternatives Considered*: Loading external `.gltf` or `.hdr` assets (unreliable and prone to network 404 failures in sandbox).
- **Decision 3: Bento Grid Layout Architecture**
  - *Chosen Approach*: 4-card asymmetric layout (Card 1: Marquee 2-column span for Dual-Key Ingestion; Card 2: 16 Stop Gates checklist; Card 3: Timeline DAG hierarchy; Card 4: Webhook Dispatch live stream).
  - *Why*: Perfectly fulfills prompt requirement #2 with editorial numbers `01-04` and interactive technical mini-widgets.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             React Application Root                          │
│                                (src/App.tsx)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Top Navigation Bar (Brand Wordmark, 4 Nav Links, Gateway Config CTA)  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Hero Section                                                          │  │
│  │ ├─ High-Contrast Headline & Value Pitch                               │  │
│  │ ├─ Real-Time Backend Status Bar (Latency, Endpoint, State)            │  │
│  │ ├─ Statistics Strip (4 Key Metrics, Tabular Numerals)                 │  │
│  │ ├─ HighImpactPrimaryButton ("เริ่มต้นเชื่อมต่อระบบ", "ทดสอบ Webhook")    │  │
│  │ └─ Three.js 3D Scene Viewport (Cryptographic Node + Bottom Dock)      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Bento Grid Features Section (Cards 01 - 04)                           │  │
│  │ ├─ 01. Dual-Key Ledger Ingestion (Interactive Multi-Signature Demo)   │  │
│  │ ├─ 02. 16 Stop Gates Compliance (Matrix Status Inspector)            │  │
│  │ ├─ 03. Contract Timeline Hierarchy (SLA & Lifecycle DAG)              │  │
│  │ └─ 04. Webhook Backend Dispatch (Live Delivery Queue & Telemetry)     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Pricing Matrix Section                                                │  │
│  │ ├─ Billing Toggle (Monthly / Annual with 20% discount badge)          │  │
│  │ ├─ Card 1: Community (0฿)                                             │  │
│  │ ├─ Card 2: Professional (2,900฿/mo, Cyan Neon Glow, Most Popular)     │  │
│  │ └─ Card 3: Custom Enterprise (Custom quote & SLA)                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Contact & Ticket Issuance Section                                     │  │
│  │ ├─ Real-Time Validated Form (Name, Org, Email, Volume, Message)       │  │
│  │ ├─ Algorithmic Ticket ID Generator (e.g. TKT-2026-X89B)               │  │
│  │ └─ Automated Webhook Dispatch on Submission                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Modals & Floating Drawers                                             │  │
│  │ ├─ User Backend Gateway Configuration Modal (Base URL, Webhook, Key)  │  │
│  │ └─ Live Payload & Telemetry Inspector Drawer (Outbound JSON / Status) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Footer (Wordmark, Direct Links, Legal Notice, System Status)          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                      Dispatches Real HTTP / Simulated
                                       ▼
     ┌───────────────────────────────────────────────────────────────────┐
     │   User Backend Gateway Engine (src/services/backendGateway.ts)    │
     │   - localStorage Configuration Persistence                        │
     │   - Direct Fetch with CORS & Error Handling                       │
     │   - Built-in Mock Simulator with 120ms Latency & 200/201 Status   │
     │   - Event Dispatcher & Live Log Streaming                         │
     └───────────────────────────────────────────────────────────────────┘
```

### Data Model & State Entities

- **GatewayConfig**:
  ```ts
  interface GatewayConfig {
    baseUrl: string; // e.g. "https://api.myenterprise.com/v1"
    webhookEndpoint: string; // e.g. "/webhooks/contracts"
    apiKey: string; // Secret key for Authorization header
    isSimulationMode: boolean; // Toggle fallback simulator
    lastPingStatus: 'connected' | 'disconnected' | 'testing';
    latencyMs: number;
  }
  ```
- **PayloadLog**:
  ```ts
  interface PayloadLog {
    id: string;
    timestamp: string;
    action: string;
    targetUrl: string;
    payload: Record<string, any>;
    status: number;
    latencyMs: number;
    response: Record<string, any>;
  }
  ```
- **TicketRecord**:
  ```ts
  interface TicketRecord {
    ticketId: string;
    name: string;
    organization: string;
    email: string;
    contractVolume: string;
    message: string;
    createdAt: string;
    status: 'received' | 'queued' | 'dispatched';
  }
  ```

### Interactive Component & State Mapping

1. **HighImpactPrimaryButton Component**:
   - Reusable across all CTA locations with customizable action type (`'plan_select'`, `'ticket_submit'`, `'webhook_test'`, `'audit_run'`).
   - Dispatches payloads through `backendGateway.dispatchAction(action, payload)`.
   - Triggers the floating telemetry pill notifying the user that a payload was sent and logged.
2. **Contact Form Validation**:
   - State managed with instant field-level dirty validation (Email regex check, min length for name/org, required volume selector).
   - Shows clean error helper text only after user interaction.
   - Successful submit produces a modal confirmation with copyable Ticket ID and dispatches payload to backend gateway.
3. **Three.js 3D Scene**:
   - Encapsulated in `ThreeScene.tsx` with ref-based canvas mount.
   - Listens to mouse movement with exponential damping for smooth parallax.
   - Bottom dock provides controls for wireframe mode, rotation speed, and exploded inspection view without obscuring the canvas.
