import json
import logging
from typing import Dict, Any, Optional, Callable
from app.models.schemas import BasicCompanyDNA, FounderInfo, LeaderInfo, LocationInfo, CompanySizeInfo, IndustryInfo, AgeInfo
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

BASIC_AGENT_SYSTEM_PROMPT = """You are the Lead Forensic Profiler Agent for executive-level company intelligence.
Your task is to analyze raw company web content and search signals to construct an exhaustive forensic profile.

ANTI-HALLUCINATION & EVIDENCE GROUNDING PROTOCOL:
1. You must ONLY report data corresponding strictly to the requested target company. 
2. NEVER invent founder names or pull names of random authors from blog articles unless they are confirmed as founders/executives of the company.
3. If headcount or employee count is not public, state 'Early-Stage / Undisclosed' or an honest bracket based on company maturity.
4. Extract:
   - Company name & legal entity name
   - High-impact tagline/mission statement
   - Founders (names, roles, background)
   - Key Leadership team
   - Headquarters location, global satellite offices, work policy
   - Company Size (headcount bracket)
   - Industry & micro-vertical classification
   - Founded year and age

Output ONLY a valid JSON object matching this schema:
{
  "company_name": "<Company Name>",
  "legal_name": null,
  "tagline": "<Tagline or mission statement>",
  "website": "<Website URL>",
  "founders": [{"name": "<Founder Name>", "role": "<Role>", "background": "<Background>"}],
  "leadership": [{"name": "<Leader Name>", "role": "<Role>", "background": "<Background>"}],
  "location": {
    "headquarters": "<City, Country or 'Undisclosed'>",
    "global_offices": [],
    "work_policy": "Hybrid / Remote / In-office"
  },
  "size": {
    "headcount": "<e.g. 11-50 employees / 51-200 employees / Undisclosed>",
    "estimated_employees": null,
    "department_breakdown": null,
    "growth_trend": null
  },
  "industry": {
    "primary": "<Primary Industry>",
    "sub_sectors": ["<Sub-sector 1>"],
    "tags": ["<Tag 1>"]
  },
  "age": {
    "founded_year": null,
    "age_years": null,
    "historical_summary": "<Founding summary>"
  }
}
"""

class BasicDNAAgent:
    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name

    async def investigate(
        self,
        company_name: str,
        website_url: Optional[str],
        web_context: str,
        log_callback: Optional[Callable[[str], Any]] = None
    ) -> BasicCompanyDNA:
        if log_callback:
            await log_callback(f"[DNA Agent] Investigating corporate registration, founders, and executive structure for {company_name}...")

        user_prompt = f"""Target Company: {company_name}
Target Website: {website_url or 'N/A'}

RAW DISCOVERED INTELLIGENCE & CONTEXT:
{web_context}

Perform forensic profile extraction now. Return JSON only."""

        try:
            raw_data = await nvidia_client.complete_structured(
                prompt=user_prompt,
                system_prompt=BASIC_AGENT_SYSTEM_PROMPT,
                model=self.model_name
            )

            # Map into Pydantic model with safety fallbacks
            founders = []
            for f in raw_data.get("founders", []):
                try:
                    founders.append(FounderInfo(**f) if isinstance(f, dict) else FounderInfo(name=str(f)))
                except Exception:
                    founders.append(FounderInfo(name=str(f) if not isinstance(f, dict) else str(f.get("name", "Founder"))))

            leadership = []
            for l in raw_data.get("leadership", []):
                try:
                    leadership.append(LeaderInfo(**l) if isinstance(l, dict) else LeaderInfo(name=str(l), role="Executive"))
                except Exception:
                    leadership.append(LeaderInfo(name=str(l) if not isinstance(l, dict) else str(l.get("name", "Executive")), role="Executive"))
            
            try:
                loc_data = raw_data.get("location", {})
                location = LocationInfo(**loc_data) if isinstance(loc_data, dict) else LocationInfo(headquarters=str(loc_data) if loc_data else "Unknown")
            except Exception:
                location = LocationInfo()

            try:
                size_data = raw_data.get("size", {})
                size = CompanySizeInfo(**size_data) if isinstance(size_data, dict) else CompanySizeInfo(headcount=str(size_data) if size_data else "Unknown")
            except Exception:
                size = CompanySizeInfo()

            try:
                ind_data = raw_data.get("industry", {})
                industry = IndustryInfo(**ind_data) if isinstance(ind_data, dict) else IndustryInfo()
            except Exception:
                industry = IndustryInfo()

            try:
                age_data = raw_data.get("age", {})
                age = AgeInfo(**age_data) if isinstance(age_data, dict) else AgeInfo()
            except Exception:
                age = AgeInfo()

            return BasicCompanyDNA(
                company_name=raw_data.get("company_name", company_name),
                legal_name=raw_data.get("legal_name"),
                tagline=raw_data.get("tagline"),
                website=raw_data.get("website", website_url),
                founders=founders,
                leadership=leadership,
                location=location,
                size=size,
                industry=industry,
                age=age
            )
        except Exception as e:
            logger.error(f"Error in BasicDNAAgent: {e}")
            if log_callback:
                await log_callback(f"[DNA Agent Warning] Using heuristic fallback: {e}")
            return BasicCompanyDNA(
                company_name=company_name,
                website=website_url,
                industry=IndustryInfo(primary="Enterprise Software / Tech")
            )

basic_agent = BasicDNAAgent()
