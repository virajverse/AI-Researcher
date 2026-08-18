import logging
from typing import Dict, Any, Optional, Callable, List
from app.models.schemas import TechnologyForensics, TechStackInfo, AIUsageInfo, APIInfo
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

TECH_AGENT_SYSTEM_PROMPT = """You are the Lead Tech Stack & AI Architecture Forensic Detective.
Your objective is to reverse-engineer and deduce the company's full technical infrastructure, AI integrations, API ecosystem, and developer tooling.

CRITICAL INSTRUCTIONS:
1. You must ONLY report tech stack and architecture signals for the requested target company.
   - Strictly prioritize the live-detected code/header signatures provided in the prompt.
   - Do NOT copy tech stacks from unrelated big tech giants.
2. Merge the provided live-detected technology signals with deep knowledge and search context to extract:
   - Frontend stack (React, Next.js, TypeScript, Tailwind, Vue, etc.)
   - Backend & Services (Node.js, Go, Python/FastAPI, Rust, Java/Spring, GraphQL, gRPC)
   - Databases & Data Infra (PostgreSQL, Redis, Snowflake, ClickHouse, MongoDB, Kafka)
   - Cloud & Hosting (AWS, GCP, Cloudflare, Vercel, Kubernetes, Docker)
   - DevOps & Tooling (GitHub Actions, Datadog, Sentry, Terraform)
   - AI Usage (Specific LLM models e.g. OpenAI/Anthropic/Llama, Vector DBs e.g. Pinecone/Qdrant, proprietary AI training, AI agents, copilot features)
   - APIs & Integrations (Public API surface, SDK availability, Webhook support, Partner ecosystems)
   - Infrastructure & Scalability notes
   - Internal Automation & Workflow tools

2. Output ONLY a valid JSON object matching this schema:
{
  "tech_stack": {
    "frontend": ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    "backend": ["Node.js", "Go", "Python / FastAPI", "GraphQL"],
    "databases": ["PostgreSQL", "Redis", "ClickHouse"],
    "cloud_and_infra": ["AWS (us-east-1)", "Cloudflare Edge", "Kubernetes"],
    "devops_and_tools": ["GitHub Actions", "Datadog", "Sentry", "Terraform"]
  },
  "ai_usage": {
    "ai_features": ["Automated summary generation", "Smart AI Copilot", "Semantic vector search"],
    "models_or_providers": ["OpenAI GPT-4o", "Anthropic Claude 3.5 Sonnet", "Llama 3.3 Fine-tuned"],
    "proprietary_ai": false,
    "ai_maturity_rating": "Advanced",
    "technical_details": "RAG pipeline leveraging pgvector and custom re-ranking models..."
  },
  "apis_and_ecosystem": {
    "api_types": ["REST API", "GraphQL API", "Webhooks"],
    "developer_portal_url": "https://developers.example.com",
    "sdks_supported": ["Python", "TypeScript / Node", "Go", "Ruby"],
    "major_integrations": ["Slack", "GitHub", "Jira", "Salesforce", "Linear"]
  },
  "infrastructure_notes": [
    "Multi-region cloud deployment with automated failover",
    "Sub-100ms global API latency backed by Cloudflare Workers"
  ],
  "automation_tooling": [
    "Automated CI/CD deployment pipelines",
    "Internal synthetic monitoring and chaos testing"
  ]
}
"""

class TechDetectiveAgent:
    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name

    async def investigate(
        self,
        company_name: str,
        website_url: Optional[str],
        web_context: str,
        detected_tech_signals: Dict[str, List[str]],
        log_callback: Optional[Callable[[str], Any]] = None
    ) -> TechnologyForensics:
        if log_callback:
            await log_callback(f"[Tech Detective] Scanning HTML signatures, DNS, and AI model usage for {company_name}...")

        user_prompt = f"""Target Company: {company_name}
Target Website: {website_url or 'N/A'}

AUTOMATIC LIVE-DETECTED CODE/HEADER SIGNATURES:
{detected_tech_signals}

RAW DISCOVERED INTELLIGENCE & ENGINEERING BLOG CONTEXT:
{web_context}

Perform forensic tech stack & AI architecture analysis now. Return JSON only."""

        try:
            raw_data = await nvidia_client.complete_structured(
                prompt=user_prompt,
                system_prompt=TECH_AGENT_SYSTEM_PROMPT,
                model=self.model_name
            )

            ts_data = raw_data.get("tech_stack", {})
            tech_stack = TechStackInfo(**ts_data) if isinstance(ts_data, dict) else TechStackInfo()

            ai_data = raw_data.get("ai_usage", {})
            ai_usage = AIUsageInfo(**ai_data) if isinstance(ai_data, dict) else AIUsageInfo()

            api_data = raw_data.get("apis_and_ecosystem", {})
            api_info = APIInfo(**api_data) if isinstance(api_data, dict) else APIInfo()

            return TechnologyForensics(
                tech_stack=tech_stack,
                ai_usage=ai_usage,
                apis_and_ecosystem=api_info,
                infrastructure_notes=raw_data.get("infrastructure_notes", []),
                automation_tooling=raw_data.get("automation_tooling", [])
            )
        except Exception as e:
            logger.error(f"Error in TechDetectiveAgent: {e}")
            if log_callback:
                await log_callback(f"[Tech Agent Warning] Fallback applied: {e}")
            return TechnologyForensics(
                tech_stack=TechStackInfo(frontend=["Modern Web App"], backend=["Cloud Services"])
            )

tech_agent = TechDetectiveAgent()
