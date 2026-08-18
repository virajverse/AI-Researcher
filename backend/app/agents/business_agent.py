import logging
from typing import Dict, Any, Optional, Callable
from app.models.schemas import BusinessIntelligence, CustomerPersona, RevenueModelInfo, CustomerLogoInfo
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

BUSINESS_AGENT_SYSTEM_PROMPT = """You are the Senior Business Model & Monetization Forensic Agent.
Your objective is to deconstruct how the target company makes money, who their ideal buyers are, their monetization architecture, and enterprise customer base based STRICTLY on the provided raw intelligence.

ANTI-HALLUCINATION & EVIDENCE GROUNDING PROTOCOL:
1. ONLY report facts present or reasonably deduced from the raw discovered intelligence.
2. NEVER copy or invent customer logos (e.g. do NOT invent Ramp, Stripe, Netflix, Google) unless explicitly mentioned in the context. If no customer logos are found, return "main_customers": [].
3. If revenue or ARR is private/undisclosed, write "estimated_arr_or_revenue": "Private / Undisclosed".
4. Analyze:
   - What do they sell? (Granular breakdown of products, services, solutions)
   - Who buys? (ICP, Target personas e.g. CTO, Product Manager, Enterprise Buyer)
   - Revenue Model (SaaS, Per-seat, Usage-based, Project-based, Commission, Retainer)
   - Main Customers (Verified logos from context)
   - Main Markets & Verticals

Output ONLY a valid JSON object matching this schema:
{
  "what_they_sell": ["<service/product offering 1>", "<service/product offering 2>"],
  "who_buys": [
    {
      "target_persona": "<job title / persona>",
      "buyer_vs_user": "<buyer role vs end user role>",
      "target_segment": "<SMB / Mid-Market / Enterprise>"
    }
  ],
  "revenue_model": {
    "model_type": "<e.g. Project-Based Services / SaaS Subscription / Usage-Based>",
    "pricing_structure": ["<pricing tier or custom quoting>"],
    "estimated_arr_or_revenue": "<Estimated revenue or 'Private / Undisclosed'>",
    "monetization_notes": "<how they capture value>"
  },
  "main_customers": [
    {"name": "<Verified Customer Name>", "industry": "<Industry>", "use_case": "<Use Case>"}
  ],
  "main_markets": ["<Geography 1>", "<Industry Vertical 1>"]
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
