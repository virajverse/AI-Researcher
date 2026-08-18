import logging
from typing import Dict, Any, Optional, Callable
from app.models.schemas import CompetitiveLandscape, CompetitorProfile, LagBehindArea
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

COMPETITOR_AGENT_SYSTEM_PROMPT = """You are the Competitive Intelligence & Battlecard Forensic Agent.
Your objective is to map the target company's competitive landscape, identifying direct/indirect competitors, defensible moats, and critical vulnerability areas where they lag behind competitors.

CRITICAL INSTRUCTIONS:
1. You must ONLY map real competitors and market dynamics for the specific industry of the target company.
2. Extract or deduce exact details for:
   - Competitors (Direct, Indirect, and Emerging Disruptors in their specific sector)
   - Key Differentiators & Moat (Why do customers pick them? Speed, UX, proprietary data, network effects, cost)
   - Where they lag behind (Specific technical or business gaps, which competitor beats them here, and deal impact)
   - High-level Competitive summary

2. Output ONLY a valid JSON object matching this schema:
{
  "competitors": [
    {
      "name": "Competitor Alpha",
      "category": "Direct",
      "key_differences": "Competitor Alpha has a broader legacy ecosystem but slower release cycle and outdated UI.",
      "pricing_comparison": "Target is ~30% more expensive per seat",
      "market_position": "Incumbent Market Leader"
    },
    {
      "name": "Disruptor Beta",
      "category": "Emerging Disruptor",
      "key_differences": "Open-source alternative offering self-hosting and local LLM execution.",
      "pricing_comparison": "Free open core with paid cloud",
      "market_position": "Fast-growing open-source community"
    }
  ],
  "differentiators_and_moat": [
    "Proprietary low-latency real-time synchronization engine",
    "Superior developer-first ergonomics and CLI tooling",
    "High switching costs due to deep API integration"
  ],
  "where_they_lag": [
    {
      "area": "Enterprise Role-Based Access Control (RBAC) & Audit Logs",
      "better_competitors": ["Competitor Alpha", "Competitor Gamma"],
      "deal_impact": "Causes friction in Fortune 500 security compliance reviews."
    },
    {
      "area": "Native Mobile Application Experience",
      "better_competitors": ["Competitor Delta"],
      "deal_impact": "Restricts adoption among field operations teams."
    }
  ],
  "competitive_summary": "The company holds a strong lead in developer velocity and modern UI, but faces pressure from enterprise-ready incumbents on compliance and bottom-up open-source disruptors."
}
"""

class CompetitiveLandscapeAgent:
    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name

    async def investigate(
        self,
        company_name: str,
        website_url: Optional[str],
        web_context: str,
        log_callback: Optional[Callable[[str], Any]] = None
    ) -> CompetitiveLandscape:
        if log_callback:
            await log_callback(f"[Competitor Agent] Mapping competitive battlecards and weakness gaps for {company_name}...")

        user_prompt = f"""Target Company: {company_name}
Target Website: {website_url or 'N/A'}

RAW DISCOVERED INTELLIGENCE & COMPARISON CONTEXT:
{web_context}

Perform competitive battlecard & lag-behind vulnerability analysis now. Return JSON only."""

        try:
            raw_data = await nvidia_client.complete_structured(
                prompt=user_prompt,
                system_prompt=COMPETITOR_AGENT_SYSTEM_PROMPT,
                model=self.model_name
            )

            competitors = [CompetitorProfile(**c) if isinstance(c, dict) else CompetitorProfile(name=str(c), category="Direct", key_differences="") for c in raw_data.get("competitors", [])]
            lags = [LagBehindArea(**l) if isinstance(l, dict) else LagBehindArea(area=str(l), better_competitors=[], deal_impact="") for l in raw_data.get("where_they_lag", [])]

            return CompetitiveLandscape(
                competitors=competitors,
                differentiators_and_moat=raw_data.get("differentiators_and_moat", []),
                where_they_lag=lags,
                competitive_summary=raw_data.get("competitive_summary")
            )
        except Exception as e:
            logger.error(f"Error in CompetitiveLandscapeAgent: {e}")
            if log_callback:
                await log_callback(f"[Competitor Agent Warning] Fallback applied: {e}")
            return CompetitiveLandscape(
                differentiators_and_moat=[f"Distinct market position of {company_name}"],
                competitive_summary="Competitive landscape mapped with standard sector peers."
            )

competitor_agent = CompetitiveLandscapeAgent()
