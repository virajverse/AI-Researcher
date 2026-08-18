import logging
from typing import Dict, Any, Optional, Callable
from app.models.schemas import (
    StrategyIntelligence, LaunchEvent, PartnershipEvent, HiringSignal, 
    FundingIntelligence, FundingRound, AcquisitionEvent
)
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

STRATEGY_AGENT_SYSTEM_PROMPT = """You are the Corporate Strategy, Funding & M&A Intelligence Agent.
Your objective is to map out the target company's corporate trajectory, capital capitalization, M&A moves, key alliances, and hiring signals based STRICTLY on evidence.

ANTI-HALLUCINATION & EVIDENCE GROUNDING PROTOCOL:
1. ONLY report funding rounds, valuation, investors, and acquisitions that are EXPLICITLY confirmed in the raw context.
2. If the company is bootstrapped, private, or has undisclosed funding, state:
   - "total_raised": "Bootstrapped / Undisclosed"
   - "current_valuation": "Private / Undisclosed"
   - "rounds": []
   - "top_investors": []
   DO NOT invent fictional Sequoia, YC, or Series A rounds!
3. If no strategic partnerships or acquisitions are mentioned, return empty lists: "partnerships": [], "acquisitions": [].

Output ONLY a valid JSON object matching this schema:
{
  "recent_launches": [
    {
      "headline": "<Verified launch headline>",
      "date_or_timeframe": "<Date or timeframe>",
      "details": "<Summary of launch>"
    }
  ],
  "partnerships": [
    {
      "partner": "<Verified Partner Name>",
      "collaboration_scope": "<Scope of partnership>"
    }
  ],
  "hiring_trends": {
    "open_role_categories": ["<Role 1>", "<Role 2>"],
    "strategic_focus_areas": ["<Focus Area 1>"],
    "hiring_intensity": "<Low / Moderate / Aggressive>"
  },
  "expansion_moves": ["<Expansion move or geography>"],
  "funding": {
    "total_raised": "<Total raised or 'Bootstrapped / Undisclosed'>",
    "current_valuation": "<Valuation or 'Private / Undisclosed'>",
    "rounds": [],
    "top_investors": []
  },
  "acquisitions": [],
  "strategic_initiatives_summary": "<Synthesis of company strategic direction>"
}
"""

class StrategyIntelligenceAgent:
    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name

    async def investigate(
        self,
        company_name: str,
        website_url: Optional[str],
        web_context: str,
        log_callback: Optional[Callable[[str], Any]] = None
    ) -> StrategyIntelligence:
        if log_callback:
            await log_callback(f"[Strategy Agent] Tracing funding rounds, M&A deals, and hiring signals for {company_name}...")

        user_prompt = f"""Target Company: {company_name}
Target Website: {website_url or 'N/A'}

RAW DISCOVERED INTELLIGENCE & CRUNCHBASE/NEWS CONTEXT:
{web_context}

Perform corporate strategy, funding, and M&A forensic investigation now. Return JSON only."""

        try:
            raw_data = await nvidia_client.complete_structured(
                prompt=user_prompt,
                system_prompt=STRATEGY_AGENT_SYSTEM_PROMPT,
                model=self.model_name
            )

            launches = [LaunchEvent(**l) if isinstance(l, dict) else LaunchEvent(headline=str(l)) for l in raw_data.get("recent_launches", [])]
            partnerships = [PartnershipEvent(**p) if isinstance(p, dict) else PartnershipEvent(partner=str(p), collaboration_scope="") for p in raw_data.get("partnerships", [])]
            
            h_data = raw_data.get("hiring_trends", {})
            hiring = HiringSignal(**h_data) if isinstance(h_data, dict) else HiringSignal()

            f_data = raw_data.get("funding", {})
            funding = FundingIntelligence(
                total_raised=f_data.get("total_raised"),
                current_valuation=f_data.get("current_valuation"),
                rounds=[FundingRound(**r) if isinstance(r, dict) else FundingRound(round_name=str(r)) for r in f_data.get("rounds", [])],
                top_investors=f_data.get("top_investors", [])
            ) if isinstance(f_data, dict) else FundingIntelligence()

            acquisitions = [AcquisitionEvent(**a) if isinstance(a, dict) else AcquisitionEvent(target_company=str(a)) for a in raw_data.get("acquisitions", [])]

            return StrategyIntelligence(
                recent_launches=launches,
                partnerships=partnerships,
                hiring_trends=hiring,
                expansion_moves=raw_data.get("expansion_moves", []),
                funding=funding,
                acquisitions=acquisitions,
                new_markets_targeted=raw_data.get("new_markets_targeted", [])
            )
        except Exception as e:
            logger.error(f"Error in StrategyIntelligenceAgent: {e}")
            if log_callback:
                await log_callback(f"[Strategy Agent Warning] Fallback applied: {e}")
            return StrategyIntelligence(
                funding=FundingIntelligence(total_raised="Undisclosed / Bootstrapped / Private")
            )

strategy_agent = StrategyIntelligenceAgent()
