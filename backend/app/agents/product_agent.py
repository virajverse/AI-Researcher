import logging
from typing import Dict, Any, Optional, Callable
from app.models.schemas import ProductForensics, ProductItem, RoadmapItem, UserComplaint, ReviewSentiment
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

PRODUCT_AGENT_SYSTEM_PROMPT = """You are the Product & User Sentiment Forensic Agent.
Your objective is to conduct an unfiltered audit of the target company's product suite, public roadmap, product weaknesses, and real user complaints across G2, Reddit, Capterra, and Trustpilot based STRICTLY on evidence.

ANTI-HALLUCINATION & EVIDENCE GROUNDING PROTOCOL:
1. ONLY report products, roadmaps, and features that are explicitly described on the company's website or search results.
2. DO NOT invent fictional user reviews or complaints. If no public complaints are found, return "user_complaints": [].
3. For weaknesses, identify honest architectural/business gaps based on their actual scale and offerings.

Output ONLY a valid JSON object matching this schema:
{
  "current_products": [
    {
      "name": "<Product or Service Name>",
      "description": "<What it does>",
      "target_audience": "<Target audience>",
      "key_capabilities": ["<Capability 1>", "<Capability 2>"]
    }
  ],
  "product_roadmap": [],
  "core_features": ["<Key Feature 1>", "<Key Feature 2>"],
  "weaknesses": ["<Identified Business/Product Gap 1>"],
  "user_complaints": [],
  "reviews_summary": {
    "average_rating": "<Rating e.g. 4.5 / 5.0 or 'N/A'>",
    "sentiment_score": 80,
    "top_praises": ["<Praised strength>"],
    "top_complaints": ["<Top complaint or gap>"]
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
