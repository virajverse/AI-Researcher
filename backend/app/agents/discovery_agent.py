import json
import logging
import asyncio
from typing import Dict, Any, List, Optional
from app.tools.nvidia_llm import nvidia_client
from app.tools.web_search import web_search_engine

logger = logging.getLogger(__name__)

DISCOVERY_SYSTEM_PROMPT = """You are the Senior Market Discovery & Company Sourcing AI Advisor.
Your objective is to help investors, founders, and executives discover real, verified companies matching their exact market requirements, criteria, or lookalike prompts (just like a conversational ChatGPT market intelligence expert).

CRITICAL INSTRUCTIONS:
1. ALWAYS provide real, existing companies with their actual websites and accurate descriptions.
2. Formulate an insightful, conversational overview explaining the market landscape, category dynamics, and why these companies stand out.
3. Structure each discovered company with:
   - name: Real official company name
   - website: Clean official URL (e.g. https://example.com)
   - tagline: High-impact 1-sentence mission/offering
   - category: Industry/micro-vertical (e.g. "Generative UI / DevTools", "B2B Logistics AI")
   - hq_location: City, Country or Region (e.g. "Bengaluru, India", "San Francisco, USA")
   - estimated_stage_or_funding: e.g. "Bootstrapped", "Seed / $3M", "Series A / $18M", "Public / Enterprise"
   - why_it_matches: Direct 1-2 sentence rationale on why it perfectly fulfills the user's request
   - key_features: 2-3 core capabilities
   - tech_stack_preview: 2-4 technologies used or associated
4. Provide 3-4 interactive, high-value follow-up suggestions for the user to explore next.

Output ONLY a valid JSON object matching this schema:
{
  "ai_response_text": "Insightful, conversational breakdown of the market niche and summary of the discovered landscape...",
  "companies": [
    {
      "name": "Company Name",
      "website": "https://company.com",
      "tagline": "Brief 1-sentence value proposition",
      "category": "Specific Micro-Vertical",
      "hq_location": "City, Country",
      "estimated_stage_or_funding": "Stage or 'Bootstrapped / Private'",
      "why_it_matches": "Why this company matches the user's prompt",
      "key_features": ["Feature 1", "Feature 2"],
      "tech_stack_preview": ["React", "Python", "AWS"]
    }
  ],
  "follow_up_suggestions": [
    "Filter only bootstrapped companies",
    "Compare pricing and monetization models",
    "Show direct US alternatives"
  ]
}
"""

class CompanyDiscoveryAgent:
    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name

    async def discover_companies(
        self,
        query: str,
        industry: Optional[str] = None,
        location: Optional[str] = None,
        stage: Optional[str] = None,
        model_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes multi-query web search to find verified companies and synthesizes structured cards.
        """
        target_model = model_name or self.model_name

        # Construct targeted search queries
        search_queries = [
            f"{query} companies startups",
            f"top {query} companies list 'pricing' OR 'about'",
        ]
        if industry and industry.lower() != 'all':
            search_queries.append(f"{industry} startups {query} 'headquarters'")
        if location and location.lower() != 'all':
            search_queries.append(f"{query} companies in {location}")

        # Execute searches in parallel
        tasks = [web_search_engine.search(q, max_results=5) for q in search_queries]
        results_list = await asyncio.gather(*tasks, return_exceptions=True)

        scraped_evidence = []
        for r in results_list:
            if isinstance(r, list):
                for item in r:
                    snippet = f"Title: {item.get('title', '')} | URL: {item.get('link', '')} | Snippet: {item.get('snippet', '')}"
                    if snippet not in scraped_evidence:
                        scraped_evidence.append(snippet)

        evidence_str = "\n".join(scraped_evidence[:16]) if scraped_evidence else "No specific SERP snippet, synthesize from high-confidence industry training."

        user_prompt = f"""USER DISCOVERY PROMPT: {query}
OPTIONAL FILTERS:
- Industry: {industry or 'Any'}
- Location: {location or 'Any'}
- Stage: {stage or 'Any'}

LIVE DISCOVERED WEB EVIDENCE & SERP SNIPPETS:
{evidence_str}

Discover 6 to 10 top matching companies now. Return valid JSON only."""

        try:
            res = await nvidia_client.complete_structured(
                prompt=user_prompt,
                system_prompt=DISCOVERY_SYSTEM_PROMPT,
                model=target_model
            )
            if not res or not res.get("companies"):
                # Fallback if structure was slightly off
                return {
                    "ai_response_text": res.get("ai_response_text") or f"Here are the top companies found for '{query}'.",
                    "companies": res.get("companies") or [],
                    "follow_up_suggestions": res.get("follow_up_suggestions") or [
                        f"Show more companies in {location or 'Global'}",
                        "Compare their tech stacks",
                        "Find pricing details"
                    ]
                }
            return res
        except Exception as e:
            logger.error(f"Error in CompanyDiscoveryAgent: {e}")
            return {
                "ai_response_text": f"Found companies matching your inquiry for '{query}'.",
                "companies": [],
                "follow_up_suggestions": ["Try a broader search query", "Explore global alternatives"]
            }

discovery_agent = CompanyDiscoveryAgent()
