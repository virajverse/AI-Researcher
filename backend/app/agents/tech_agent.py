import logging
from typing import Dict, Any, Optional, Callable, List
from app.models.schemas import TechnologyForensics, TechStackInfo, AIUsageInfo, APIInfo
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

TECH_AGENT_SYSTEM_PROMPT = """You are the Lead Tech Stack & AI Architecture Forensic Detective.
Your objective is to reverse-engineer and deduce the company's technical infrastructure, AI integrations, API ecosystem, and developer tooling based STRICTLY on evidence.

ANTI-HALLUCINATION & EVIDENCE GROUNDING PROTOCOL:
1. ONLY report technologies that are confirmed by live-detected code/header signatures or explicitly stated in context.
2. DO NOT invent backend databases or cloud providers if they are not detected or stated.
3. For AI usage, if no AI models are mentioned or detected, state: "ai_maturity_rating": "Traditional / Non-AI" and "ai_features": [].
4. Analyze:
   - Frontend stack (React, Next.js, Vue, Tailwind, Angular, Vanilla JS, etc.)
   - Backend & Services (Node.js, Python, Go, Java, PHP, etc.)
   - Databases & Data Infra
   - Cloud & Hosting (AWS, GCP, Vercel, Cloudflare, DigitalOcean)
   - DevOps & Tooling
   - AI Features & LLM Usage
   - APIs & Integrations

Output ONLY a valid JSON object matching this schema:
{
  "tech_stack": {
    "frontend": ["<Detected/Verified Frontend Tech>"],
    "backend": ["<Detected/Verified Backend Tech>"],
    "databases": ["<Detected/Verified Database>"],
    "cloud_and_infra": ["<Detected Cloud/CDN>"],
    "devops_and_tools": ["<Detected DevOps Tool>"]
  },
  "ai_usage": {
    "ai_features": ["<Specific AI Feature>"],
    "models_or_providers": ["<Specific Model Provider>"],
    "proprietary_ai": false,
    "ai_maturity_rating": "<Traditional / Emerging / Advanced>",
    "technical_details": "<Architecture summary>"
  },
  "apis_and_ecosystem": {
    "api_types": ["<REST / GraphQL / Webhooks>"],
    "developer_portal_url": null,
    "sdks_supported": [],
    "major_integrations": []
  },
  "infrastructure_notes": ["<Infrastructure note>"],
  "automation_tooling": []
}
"""

class TechDetectiveAgent:
    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name

    async def investigate(
        self,
        company_name: str,
        website_url: Optional[str],
        web_context: str,
        detected_tech_signals: Dict[str, List[str]],
        log_callback: Optional[Callable[[str], Any]] = None
    ) -> TechnologyForensics:
        if log_callback:
            await log_callback(f"[Tech Detective] Scanning HTML signatures, DNS, and AI model usage for {company_name}...")

        user_prompt = f"""Target Company: {company_name}
Target Website: {website_url or 'N/A'}

AUTOMATIC LIVE-DETECTED CODE/HEADER SIGNATURES:
{detected_tech_signals}

RAW DISCOVERED INTELLIGENCE & ENGINEERING BLOG CONTEXT:
{web_context}

Perform forensic tech stack & AI architecture analysis now. Return JSON only."""

        try:
            raw_data = await nvidia_client.complete_structured(
                prompt=user_prompt,
                system_prompt=TECH_AGENT_SYSTEM_PROMPT,
                model=self.model_name
            )

            ts_data = raw_data.get("tech_stack", {})
            tech_stack = TechStackInfo(**ts_data) if isinstance(ts_data, dict) else TechStackInfo()

            ai_data = raw_data.get("ai_usage", {})
            ai_usage = AIUsageInfo(**ai_data) if isinstance(ai_data, dict) else AIUsageInfo()

            api_data = raw_data.get("apis_and_ecosystem", {})
            api_info = APIInfo(**api_data) if isinstance(api_data, dict) else APIInfo()

            return TechnologyForensics(
                tech_stack=tech_stack,
                ai_usage=ai_usage,
                apis_and_ecosystem=api_info,
                infrastructure_notes=raw_data.get("infrastructure_notes", []),
                automation_tooling=raw_data.get("automation_tooling", [])
            )
        except Exception as e:
            logger.error(f"Error in TechDetectiveAgent: {e}")
            if log_callback:
                await log_callback(f"[Tech Agent Warning] Fallback applied: {e}")
            return TechnologyForensics(
                tech_stack=TechStackInfo(frontend=["Modern Web App"], backend=["Cloud Services"])
            )

tech_agent = TechDetectiveAgent()
