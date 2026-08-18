import logging
from typing import Dict, Any, Optional, Callable
from app.models.schemas import (
    StrategyIntelligence, LaunchEvent, PartnershipEvent, HiringSignal, 
    FundingIntelligence, FundingRound, AcquisitionEvent
)
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

STRATEGY_AGENT_SYSTEM_PROMPT = """You are the Corporate Strategy, Funding & M&A Intelligence Agent.
Your objective is to map out the target company's corporate trajectory, capital capitalization, M&A moves, key alliances, and hiring signals.

CRITICAL INSTRUCTIONS:
1. You must ONLY report funding, launches, and strategy for the requested target company. If funding/investor data is private or undisclosed, state 'Private / Undisclosed / Bootstrapped' rather than inventing fictional rounds.
2. Extract or deduce exact details for:
   - Recent Launches (Major announcements, new products, 2024-2026 releases)
   - Strategic Partnerships & Ecosystem Alliances
   - Hiring Trends & Signals (Aggressive expansion in AI, Enterprise Sales, Security)
   - Expansion Moves (New geographic offices, entering new verticals)
   - Funding History (Total capital raised, Series rounds, Valuation, Lead Investors)
   - Acquisitions (Companies acquired, talent acquisitions, technology absorption)
   - New Markets Targeted

2. Output ONLY a valid JSON object matching this schema:
{
  "recent_launches": [
    {
      "headline": "Launch of AI Autonomous Agent Suite",
      "date_or_timeframe": "Late 2024 / Early 2025",
      "details": "Introduced deep multi-agent workflow capabilities with enterprise governance."
    }
  ],
  "partnerships": [
    {
      "partner": "AWS & Snowflake",
      "collaboration_scope": "Joint go-to-market and seamless zero-ETL data integration"
    }
  ],
  "hiring_trends": {
    "open_role_categories": ["AI/ML Research Engineers", "Enterprise Account Executives", "Security & Compliance"],
    "strategic_focus_areas": ["Enterprise GTM Expansion", "Core AI Model Optimization"],
    "hiring_intensity": "Aggressive"
  },
  "expansion_moves": [
    "Opened new EMEA headquarters in London",
    "Expanding enterprise coverage in Japan and APAC"
  ],
  "funding": {
    "total_raised": "$180M",
    "current_valuation": "$1.8 Billion (Unicorn)",
    "rounds": [
      {
        "round_name": "Series C",
        "amount_raised": "$100M",
        "lead_investors": ["Sequoia Capital", "Index Ventures"],
        "valuation": "$1.8B",
        "date": "2024"
      }
    ],
    "top_investors": ["Sequoia Capital", "Index Ventures", "Y Combinator"]
  },
  "acquisitions": [
    {
      "target_company": "DataSync Corp",
      "date": "2023",
      "strategic_reason": "Acquired real-time stream sync technology and engineering talent."
    }
  ],
  "new_markets_targeted": ["Financial Services", "Healthcare & Life Sciences"]
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
