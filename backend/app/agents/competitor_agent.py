import logging
from typing import Dict, Any, Optional, Callable
from app.models.schemas import CompetitiveLandscape, CompetitorProfile, LagBehindArea
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

COMPETITOR_AGENT_SYSTEM_PROMPT = """You are the Competitive Intelligence & Battlecard Forensic Agent.
Your objective is to map the target company's competitive landscape, identifying real direct/indirect competitors, defensible moats, and critical vulnerability areas where they lag behind competitors based STRICTLY on evidence.

ANTI-HALLUCINATION & EVIDENCE GROUNDING PROTOCOL:
1. ONLY list real direct competitors that operate in the same specific vertical and business model.
2. DO NOT list generic tech giants (like Microsoft, Google, AWS) unless the company directly competes in that specific niche.
3. Analyze:
   - Real Competitors in this exact market
   - True Differentiators & Moats (e.g. specialized domain knowledge, agility, customer intimacy, pricing model)
   - Real Lag Behind Areas
   - High-level Competitive summary

Output ONLY a valid JSON object matching this schema:
{
  "competitors": [
    {
      "name": "<Real Competitor Company Name>",
      "category": "<Direct / Indirect / Emerging Disruptor>",
      "key_differences": "<Specific difference in product, market, or pricing>",
      "pricing_comparison": "<Comparison note or 'Similar pricing'>",
      "market_position": "<Incumbent / Peer / Challenger>"
    }
  ],
  "differentiators_and_moat": [
    "<Real Moat / Differentiator 1>",
    "<Real Moat / Differentiator 2>"
  ],
  "where_they_lag": [
    {
      "area": "<Specific technical or market gap>",
      "better_competitors": ["<Competitor who leads here>"],
      "deal_impact": "<Impact on winning deals or scaling>"
    }
  ],
  "competitive_summary": "<Synthesis of company competitive standing>"
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
