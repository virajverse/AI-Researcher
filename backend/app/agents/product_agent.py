import logging
from typing import Dict, Any, Optional, Callable
from app.models.schemas import ProductForensics, ProductItem, RoadmapItem, UserComplaint, ReviewSentiment
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

PRODUCT_AGENT_SYSTEM_PROMPT = """You are the Product & User Sentiment Forensic Agent.
Your objective is to conduct an unfiltered audit of the target company's product suite, public roadmap, product weaknesses, and real user complaints across G2, Reddit, Capterra, and Hacker News.

CRITICAL INSTRUCTIONS:
1. You must ONLY report features and sentiment for the requested target company. Do NOT copy features or reviews from unrelated companies.
2. Extract or deduce exact details for:
   - Current products & capabilities (Specific module names, target use case)
   - Product Roadmap (Public beta features, upcoming major versions, announced capabilities)
   - Core Features & superpowers
   - Product Weaknesses (Missing integrations, performance bottlenecks, steep learning curve, scaling pain points)
   - Real User Complaints (Categorized by: Pricing, Support, UI/UX, Scalability, Integrations, Bugs)
   - Review Sentiment (Rating estimate, sentiment score 0-100, top praises & complaints)

2. Output ONLY a valid JSON object matching this schema:
{
  "current_products": [
    {
      "name": "string",
      "description": "string",
      "target_audience": "string",
      "key_capabilities": ["string", "string"]
    }
  ],
  "product_roadmap": [
    {
      "feature_or_milestone": "string",
      "status": "In Beta / Q3 Target / Announced",
      "impact": "string"
    }
  ],
  "core_features": ["string", "string", "string"],
  "weaknesses": [
    "High pricing barrier for early startups",
    "Limited native support for legacy enterprise on-prem setups",
    "Occasional latency spikes during high-throughput batches"
  ],
  "user_complaints": [
    {
      "category": "Pricing",
      "description": "Sudden price hikes upon scaling beyond base usage tiers",
      "source_platform": "Reddit / G2",
      "severity": "High"
    },
    {
      "category": "Support",
      "description": "Slow response times on non-enterprise priority tickets",
      "source_platform": "Trustpilot",
      "severity": "Medium"
    }
  ],
  "reviews_summary": {
    "average_rating": "4.6 / 5.0",
    "sentiment_score": 82,
    "positive_highlights": ["Blazing fast UI", "Intuitive developer API", "Reliable uptime"],
    "negative_highlights": ["Enterprise plan is costly", "Documentation lacks complex edge cases"],
    "nps_indicator": "Strong Positive (+48)"
  }
}
"""

class ProductSentimentAgent:
    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name

    async def investigate(
        self,
        company_name: str,
        website_url: Optional[str],
        web_context: str,
        log_callback: Optional[Callable[[str], Any]] = None
    ) -> ProductForensics:
        if log_callback:
            await log_callback(f"[Product Agent] Mining user sentiment, G2/Reddit complaints, and feature roadmap for {company_name}...")

        user_prompt = f"""Target Company: {company_name}
Target Website: {website_url or 'N/A'}

RAW DISCOVERED INTELLIGENCE & CONTEXT:
{web_context}

Perform deep product & user complaint forensic investigation now. Return JSON only."""

        try:
            raw_data = await nvidia_client.complete_structured(
                prompt=user_prompt,
                system_prompt=PRODUCT_AGENT_SYSTEM_PROMPT,
                model=self.model_name
            )

            products = [ProductItem(**p) if isinstance(p, dict) else ProductItem(name=str(p), description="") for p in raw_data.get("current_products", [])]
            roadmap = [RoadmapItem(**r) if isinstance(r, dict) else RoadmapItem(feature_or_milestone=str(r), status="Planned") for r in raw_data.get("product_roadmap", [])]
            complaints = [UserComplaint(**c) if isinstance(c, dict) else UserComplaint(category="General", description=str(c)) for c in raw_data.get("user_complaints", [])]
            
            rev_data = raw_data.get("reviews_summary", {})
            sentiment = ReviewSentiment(**rev_data) if isinstance(rev_data, dict) else ReviewSentiment()

            return ProductForensics(
                current_products=products,
                product_roadmap=roadmap,
                core_features=raw_data.get("core_features", []),
                weaknesses=raw_data.get("weaknesses", []),
                user_complaints=complaints,
                reviews_summary=sentiment
            )
        except Exception as e:
            logger.error(f"Error in ProductSentimentAgent: {e}")
            if log_callback:
                await log_callback(f"[Product Agent Warning] Fallback applied: {e}")
            return ProductForensics(
                core_features=[f"Core product features of {company_name}"],
                weaknesses=["Limited public visibility on internal roadmap"]
            )

product_agent = ProductSentimentAgent()
