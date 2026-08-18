import json
import logging
import sys
import asyncio
from contextlib import asynccontextmanager

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI, HTTPException, BackgroundTasks, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, PlainTextResponse, JSONResponse
import httpx

from app.config import settings
from app.models.schemas import (
    ResearchRequest, ForensicCompanyReport, ComparisonRequest,
    PitchSimulationRequest, PitchSimulationResponse
)
from app.agents.orchestrator import orchestrator
from app.agents.pitch_simulator import pitch_simulator
from app.storage.database import db
from app.tools.mcp_manager import mcp_manager
from app.tools.nvidia_llm import nvidia_client

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("forensic-researcher")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Forensic AI Company Researcher Backend...")
    try:
        await db.init_db()
    except Exception as e:
        logger.warning(f"Database init warning: {e}")
    yield
    logger.info("Shutting down Forensic Researcher Backend.")

app = FastAPI(
    title="Forensic AI Company Researcher API",
    description="Deep forensic intelligence engine for pre-meeting company investigations powered by NVIDIA NIM & Multi-Agent Swarm.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/api")
@app.get("/api/health")
@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "VirajVerse Forensic AI Company Researcher",
        "engine": "NVIDIA NIM Multi-Agent Swarm",
        "default_model": settings.DEFAULT_LLM_MODEL
    }

@app.get("/api/models")
@app.get("/models")
async def list_models():
    """Fetch available models from NVIDIA NIM."""
    try:
        url = f"{settings.NVIDIA_BASE_URL}/models"
        headers = {"Authorization": f"Bearer {settings.NVIDIA_API_KEY}"}
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                models = [m["id"] for m in resp.json().get("data", [])]
                recommended = [
                    "meta/llama-3.3-70b-instruct",
                    "mistralai/mistral-large-2-instruct",
                    "nvidia/nemotron-4-340b-instruct",
                    "meta/llama-3.1-70b-instruct",
                    "meta/llama-3.1-8b-instruct"
                ]
                return {
                    "models": models,
                    "recommended": [m for m in recommended if m in models] or recommended
                }
    except Exception as e:
        logger.warning(f"Error fetching NVIDIA models: {e}")
    return {
        "models": ["meta/llama-3.3-70b-instruct", "meta/llama-3.1-8b-instruct", "mistralai/mistral-large-2-instruct"],
        "recommended": ["meta/llama-3.3-70b-instruct", "mistralai/mistral-large-2-instruct"]
    }

@app.get("/api/mcp/status")
@app.get("/mcp/status")
async def get_mcp_status():
    return mcp_manager.get_server_status()

# Universal POST handler for research stream (handles /api/research, /research, /api/research/stream, etc.)
@app.post("/")
@app.post("/api")
@app.post("/api/research")
@app.post("/research")
@app.post("/api/research/stream")
@app.post("/research/stream")
async def stream_research(request: ResearchRequest):
    """Server-Sent Events (SSE) stream for real-time forensic investigation."""
    return StreamingResponse(
        orchestrator.execute_research_stream(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@app.post("/api/research/sync", response_model=ForensicCompanyReport)
@app.post("/research/sync", response_model=ForensicCompanyReport)
async def sync_research(request: ResearchRequest):
    """Execute complete research synchronously and return the finished report."""
    last_report = None
    async for sse_chunk in orchestrator.execute_research_stream(request):
        if sse_chunk.startswith("data: "):
            try:
                data = json.loads(sse_chunk[6:])
                if data.get("type") == "final_report" and data.get("data"):
                    last_report = data["data"]
            except Exception:
                continue

    if not last_report:
        raise HTTPException(status_code=500, detail="Research execution failed to generate final report.")
    return last_report

@app.post("/api/simulate-pitch", response_model=PitchSimulationResponse)
@app.post("/simulate-pitch", response_model=PitchSimulationResponse)
async def simulate_pitch(request: PitchSimulationRequest):
    """Simulate real-time executive roleplay & pitch critique."""
    if request.dossier_id:
        dossier = await db.get_dossier(request.dossier_id)
        if dossier:
            tech = dossier.get("technology", {})
            prod = dossier.get("product", {})
            request.context_summary = f"Tech: {tech.get('tech_stack')}. Weaknesses: {prod.get('weaknesses')}. Complaints: {prod.get('user_complaints')}."
    
    return await pitch_simulator.simulate_pitch(request)

@app.get("/api/dossiers")
@app.get("/dossiers")
async def list_dossiers(limit: int = Query(20, ge=1, le=100)):
    return await db.list_recent_dossiers(limit=limit)

@app.get("/api/dossiers/{dossier_id}")
@app.get("/dossiers/{dossier_id}")
async def get_dossier(dossier_id: str):
    dossier = await db.get_dossier(dossier_id)
    if not dossier:
        raise HTTPException(status_code=404, detail="Dossier not found.")
    return dossier

@app.delete("/api/dossiers/{dossier_id}")
@app.delete("/dossiers/{dossier_id}")
async def delete_dossier(dossier_id: str):
    success = await db.delete_dossier(dossier_id)
    return {"success": success}

@app.get("/api/export/{dossier_id}/markdown")
@app.get("/export/{dossier_id}/markdown")
async def export_markdown(dossier_id: str):
    dossier = await db.get_dossier(dossier_id)
    if not dossier:
        raise HTTPException(status_code=404, detail="Dossier not found.")

    b = dossier.get("basic", {})
    biz = dossier.get("business", {})
    prod = dossier.get("product", {})
    tech = dossier.get("technology", {})
    strat = dossier.get("strategy", {})
    comp = dossier.get("competitive_landscape", {})
    prep = dossier.get("pre_meeting_dossier", {})

    md = f"""# FORENSIC COMPANY INTELLIGENCE DOSSIER: {dossier.get('company_name')}
**Generated**: {dossier.get('created_at')} | **Confidence**: {dossier.get('confidence_score')}% | **Engine**: {dossier.get('llm_model_used')}
**Target URL**: {dossier.get('target_url')}

---

## 1. BASIC COMPANY DNA & LEADERSHIP
- **Company Name**: {b.get('company_name')} (Legal: {b.get('legal_name') or 'N/A'})
- **Tagline**: {b.get('tagline')}
- **Headquarters**: {b.get('location', {}).get('headquarters')}
- **Size / Headcount**: {b.get('size', {}).get('headcount')}
- **Industry**: {b.get('industry', {}).get('primary')} ({', '.join(b.get('industry', {}).get('sub_sectors', []))})
- **Founded**: {b.get('age', {}).get('founded_year')} ({b.get('age', {}).get('age_years')} years active)

### Founders:
{chr(10).join([f"- **{f.get('name')}** ({f.get('role')}): {f.get('background', '')}" for f in b.get('founders', [])])}

### Key Leadership:
{chr(10).join([f"- **{l.get('name')}** ({l.get('role')}): {l.get('background', '')}" for l in b.get('leadership', [])])}

---

## 2. BUSINESS & MONETIZATION ARCHITECTURE
### What They Sell:
{chr(10).join([f"- {s}" for s in biz.get('what_they_sell', [])])}

### Who Buys (ICP):
{chr(10).join([f"- **{p.get('target_persona')}** ({p.get('target_segment')}): {p.get('buyer_vs_user')}" for p in biz.get('who_buys', [])])}

### Revenue Model:
- **Model Type**: {biz.get('revenue_model', {}).get('model_type')}
- **Estimated Revenue**: {biz.get('revenue_model', {}).get('estimated_arr_or_revenue')}
- **Pricing Structure**: {', '.join(biz.get('revenue_model', {}).get('pricing_structure', []))}

### Key Customers:
{chr(10).join([f"- **{c.get('name')}** ({c.get('industry', 'Tech')}): {c.get('use_case', '')}" for c in biz.get('main_customers', [])])}

---

## 3. PRODUCT, WEAKNESSES & USER SENTIMENT
### Core Offerings:
{chr(10).join([f"- **{p.get('name')}**: {p.get('description')}" for p in prod.get('current_products', [])])}

### Product Roadmap:
{chr(10).join([f"- **[{r.get('status')}] {r.get('feature_or_milestone')}**: {r.get('impact', '')}" for r in prod.get('product_roadmap', [])])}

### Known Weaknesses:
{chr(10).join([f"- ⚠️ {w}" for w in prod.get('weaknesses', [])])}

### Real User Complaints (G2 / Reddit / Reviews):
{chr(10).join([f"- **[{c.get('category')} - {c.get('severity')}]**: {c.get('description')} *(Source: {c.get('source_platform')})*" for c in prod.get('user_complaints', [])])}

---

## 4. TECH STACK & AI ARCHITECTURE
- **Frontend**: {', '.join(tech.get('tech_stack', {}).get('frontend', []))}
- **Backend**: {', '.join(tech.get('tech_stack', {}).get('backend', []))}
- **Databases**: {', '.join(tech.get('tech_stack', {}).get('databases', []))}
- **Cloud & Infra**: {', '.join(tech.get('tech_stack', {}).get('cloud_and_infra', []))}
- **DevOps**: {', '.join(tech.get('tech_stack', {}).get('devops_and_tools', []))}

### AI Usage:
- **AI Features**: {', '.join(tech.get('ai_usage', {}).get('ai_features', []))}
- **Models / Providers**: {', '.join(tech.get('ai_usage', {}).get('models_or_providers', []))}
- **AI Maturity**: {tech.get('ai_usage', {}).get('ai_maturity_rating')}

---

## 5. STRATEGY, FUNDING & EXPANSION
- **Total Raised**: {strat.get('funding', {}).get('total_raised')}
- **Valuation**: {strat.get('funding', {}).get('current_valuation')}
- **Top Investors**: {', '.join(strat.get('funding', {}).get('top_investors', []))}

### Recent Strategic Moves:
{chr(10).join([f"- **{l.get('headline')}** ({l.get('date_or_timeframe')}): {l.get('details', '')}" for l in strat.get('recent_launches', [])])}

---

## 6. COMPETITIVE BATTLECARD & LAG ANALYSIS
### Competitors:
{chr(10).join([f"- **{cp.get('name')}** ({cp.get('category')}): {cp.get('key_differences')}" for cp in comp.get('competitors', [])])}

### Where They Lag Behind:
{chr(10).join([f"- 🔴 **{l.get('area')}**: Better done by {', '.join(l.get('better_competitors', []))}. *Impact: {l.get('deal_impact')}*" for l in comp.get('where_they_lag', [])])}

---

## 7. PRE-MEETING EXECUTIVE DOSSIER
### High-Impact Icebreakers:
{chr(10).join([f"- 💡 {ib}" for ib in prep.get('executive_icebreakers', [])])}

### Red Flags & Landmines (Do NOT mention):
{chr(10).join([f"- 🛑 {rm}" for rm in prep.get('red_flags_and_landmines', [])])}
"""
    return PlainTextResponse(md, media_type="text/markdown")
