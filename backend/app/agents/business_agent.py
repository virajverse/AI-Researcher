import logging
from typing import Dict, Any, Optional, Callable
from app.models.schemas import BusinessIntelligence, CustomerPersona, RevenueModelInfo, CustomerLogoInfo
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

BUSINESS_AGENT_SYSTEM_PROMPT = """You are the Senior Business Model & Monetization Forensic Agent.
Your objective is to deconstruct how the target company makes money, who their ideal buyers are, their monetization architecture, and enterprise customer base.

CRITICAL INSTRUCTIONS:
1. You must ONLY report data corresponding strictly to the requested target company. Do NOT copy or hallucinate data from unrelated tech giants.
2. Extract or deduce exact details for:
   - What do they sell? (Granular breakdown of products, subscriptions, enterprise tiers, value propositions)
   - Who buys? (Ideal Customer Profile, Buyer Personas e.g. VP of Eng, CFO, Head of Product vs End Users)
   - Revenue Model (SaaS subscription, Usage/Consumption-based, Per-seat, Enterprise licensing, Marketplace rake, Hybrid)
   - Main Customers (Specific company logos, enterprise case studies, customer industries)
   - Main Markets (Geographies e.g. North America, EMEA, APAC, and Industry verticals)

2. Output ONLY a valid JSON object matching this schema:
{
  "what_they_sell": ["string - product/service offering 1", "string - offering 2"],
  "who_buys": [
    {
      "target_persona": "VP of Engineering / CTO",
      "buyer_vs_user": "Buyer: Engineering Leadership | User: Software Developers & SREs",
      "target_segment": "Enterprise & High-Growth Startups"
    }
  ],
  "revenue_model": {
    "model_type": "Hybrid Per-Seat + Usage-Based SaaS",
    "pricing_structure": ["Free / Starter Tier", "Pro: $20/seat/mo", "Enterprise: Custom ACV $50k+"],
    "estimated_arr_or_revenue": "$50M - $150M ARR",
    "monetization_notes": "Land and expand motion starting with developer adoption..."
  },
  "main_customers": [
    {"name": "Ramp", "industry": "Fintech", "use_case": "Core infrastructure automation"},
    {"name": "Vercel", "industry": "DevTools", "use_case": "Internal workflow orchestration"}
  ],
  "main_markets": ["North America (65%)", "Europe & UK (25%)", "Asia Pacific (10%)", "Fintech & Developer Tooling Verticals"]
}
"""

class BusinessModelAgent:
    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name

    async def investigate(
        self,
        company_name: str,
        website_url: Optional[str],
        web_context: str,
        log_callback: Optional[Callable[[str], Any]] = None
    ) -> BusinessIntelligence:
        if log_callback:
            await log_callback(f"[Business Agent] Deconstructing revenue model, customer logos, and ICP for {company_name}...")

        user_prompt = f"""Target Company: {company_name}
Target Website: {website_url or 'N/A'}

RAW DISCOVERED INTELLIGENCE & CONTEXT:
{web_context}

Perform business monetization & customer forensic analysis now. Return JSON only."""

        try:
            raw_data = await nvidia_client.complete_structured(
                prompt=user_prompt,
                system_prompt=BUSINESS_AGENT_SYSTEM_PROMPT,
                model=self.model_name
            )

            who_buys = [CustomerPersona(**p) if isinstance(p, dict) else CustomerPersona(target_persona=str(p), buyer_vs_user="", target_segment="") for p in raw_data.get("who_buys", [])]
            
            rev_data = raw_data.get("revenue_model", {})
            rev_model = RevenueModelInfo(**rev_data) if isinstance(rev_data, dict) else RevenueModelInfo(model_type="SaaS Subscription")

            customers = [CustomerLogoInfo(**c) if isinstance(c, dict) else CustomerLogoInfo(name=str(c)) for c in raw_data.get("main_customers", [])]

            return BusinessIntelligence(
                what_they_sell=raw_data.get("what_they_sell", []),
                who_buys=who_buys,
                revenue_model=rev_model,
                main_customers=customers,
                main_markets=raw_data.get("main_markets", [])
            )
        except Exception as e:
            logger.error(f"Error in BusinessModelAgent: {e}")
            if log_callback:
                await log_callback(f"[Business Agent Warning] Fallback applied: {e}")
            return BusinessIntelligence(
                what_they_sell=[f"Core software platforms and solutions by {company_name}"],
                revenue_model=RevenueModelInfo(model_type="B2B SaaS / Enterprise License")
            )

business_agent = BusinessModelAgent()
