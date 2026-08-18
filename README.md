# 🚀 VirajVerse — Forensic AI Company Researcher (Part 6)

> **World's Best AI Company Researcher for Pre-Meeting Forensic Intelligence.**
> Deconstruct any company to the atomic level before walking into high-stakes executive meetings, sales pitches, investment reviews, or strategic partnership negotiations.

---

## 💎 6-Pillar Forensic Spectrum & Executive Dossier

| Pillar | Focus Areas | Forensic Capabilities |
| :--- | :--- | :--- |
| **1. Basic Company DNA** | Founders, Leadership, HQ, Size, Industry, Age | Extracts legal entity, founder pedigrees, executive organogram, headcount growth rates, and history. |
| **2. Business & Monetization** | What they sell, Who buys, Revenue model, Clients | Maps core offerings, ICP & buyer personas, pricing tiers, enterprise logos, and ARR estimates. |
| **3. Product & User Sentiment** | Current products, Roadmap, Weaknesses, Complaints | Mines public roadmaps, architectural bottlenecks, and real user complaints from G2, Reddit, and Trustpilot. |
| **4. Technology & AI Detective** | Tech stack, AI usage, APIs, Infra, Automation | Detects frontend/backend/cloud frameworks, live LLM integrations, API protocols (REST/GraphQL), and DevOps. |
| **5. Strategy & Expansion** | Launches, Partnerships, Hiring, Funding, M&A | Tracks 2024–2026 releases, alliances, open hiring signals, total capital raised, cap table, and M&A deals. |
| **6. Competitive Landscape** | Battlecard, Moats, Where they lag behind | Identifies direct/indirect competitors, defensible USPs, and deal-breaking vulnerability gaps. |
| **7. Pre-Meeting Intelligence** | Icebreakers, Talking points, Landmines, 10x Questions | Generates tailored executive icebreakers, landmine warnings on what NOT to say, and high-IQ deep questions. |

---

## ⚡ Core Engine & Architecture

- **LLM Engine**: **NVIDIA NIM** (`https://integrate.api.nvidia.com/v1`) using `meta/llama-3.1-70b-instruct` and `meta/llama-3.1-8b-instruct`.
- **Scraping Swarm**:
  - **Firecrawl API / MCP**: Clean markdown web crawling and recursive sub-page discovery.
  - **Playwright Headless Scraper**: JavaScript DOM hydration, single-page application rendering, and screenshot capture.
  - **Multi-Query Web Search**: Parallel multi-dimensional search aggregator.
  - **Tech Signature Detector**: Automated HTML, HTTP headers, CDN, and DNS signature analyzer.
- **Frontend Dashboard**: Vite + React 19 + TypeScript + Cyber-Executive Glassmorphic Dark UI + Real-Time SSE Terminal.
- **Storage**: SQLite Database (`researcher.db`) for caching, history, side-by-side comparison, and 1-click PDF/Markdown exports.

---

## 🛠️ Quick Start

### 1. Launch with One Command
```bash
python run.py
```
*(Or double-click `start.bat` on Windows)*

### 2. Manual Start

**Backend**:
```bash
cd backend
.\venv\Scripts\uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend**:
```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔌 MCP (Model Context Protocol) Integration

The project includes `mcp_config.json` configured for:
- `firecrawl-mcp`: Clean markdown extraction and web crawling.
- `@executeautomation/playwright-mcp-server`: Dynamic browser automation.

---

## 📡 REST & Streaming API Endpoints

- `POST /api/research/stream`: Real-time Server-Sent Events (SSE) stream for live agent execution logs and final report.
- `POST /api/research/sync`: Synchronous execution returning full structured JSON report.
- `GET /api/dossiers`: List all saved company dossiers in SQLite.
- `GET /api/dossiers/{id}`: Fetch complete dossier by ID.
- `GET /api/export/{id}/markdown`: Generate and download formatted markdown briefing.
- `GET /api/models`: List available NVIDIA NIM models.
- `GET /api/mcp/status`: Check Firecrawl and Playwright MCP server statuses.
