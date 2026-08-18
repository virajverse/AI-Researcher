import json
import logging
from typing import Dict, Any, Optional, Callable
from app.models.schemas import BasicCompanyDNA, FounderInfo, LeaderInfo, LocationInfo, CompanySizeInfo, IndustryInfo, AgeInfo
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

BASIC_AGENT_SYSTEM_PROMPT = """You are the Lead Forensic Profiler Agent for executive-level company intelligence.
Your task is to analyze raw company web content and search signals to construct an exhaustive forensic profile.

CRITICAL INSTRUCTIONS:
1. You must ONLY report data corresponding strictly to the requested target company. 
   - NEVER hallucinate or copy info from Microsoft, Google, Apple or unrelated third parties.
   - If the company is an early-stage startup, private, or has confidential founders/headcount, state 'Private / Early-Stage' rather than inventing fictional names.
2. Extract or deduce exact details for:
   - Company name & legal entity name
   - High-impact tagline/mission statement
   - Founders (names, roles, background/pedigree, prior exits)
   - Key Leadership team (CEO, CTO, CPO, CRO, VP Eng)
   - Headquarters location, global satellite offices, work policy
   - Company Size (exact or estimated headcount bracket, growth rate)
   - Industry & micro-vertical classification
   - Founded year, age, and historical founding summary

2. Output ONLY a valid JSON object matching this schema:
{
  "company_name": "string",
  "legal_name": "string or null",
  "tagline": "string",
  "website": "string",
  "founders": [{"name": "string", "role": "string", "background": "string"}],
  "leadership": [{"name": "string", "role": "string", "background": "string"}],
  "location": {
    "headquarters": "string",
    "global_offices": ["string"],
    "work_policy": "string"
  },
  "size": {
    "headcount": "string (e.g. 500-1,000 employees)",
    "estimated_employees": 750,
    "department_breakdown": {"Engineering": "45%", "Sales & Marketing": "35%", "G&A": "20%"},
    "growth_trend": "string"
  },
  "industry": {
    "primary": "string",
    "sub_sectors": ["string"],
    "tags": ["string"]
  },
  "age": {
    "founded_year": 2020,
    "age_years": 6,
    "historical_summary": "string"
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
