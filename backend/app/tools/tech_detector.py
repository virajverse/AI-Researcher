import httpx
import re
import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

TECH_SIGNATURES = {
    "frontend": {
        "Next.js": [r"/_next/", r"__NEXT_DATA__", r"next/head"],
        "React": [r"react", r"react-dom", r"_reactRootContainer", r"data-reactroot"],
        "Vue.js": [r"vue\.min\.js", r"vue\.runtime", r"data-v-", r"__vue_app__"],
        "Nuxt.js": [r"/_nuxt/", r"__NUXT__"],
        "Angular": [r"ng-version", r"ng-app", r"angular\.js"],
        "Svelte / SvelteKit": [r"svelte-", r"__svelte", r"sveltekit"],
        "Tailwind CSS": [r"tailwind", r"tw-", r"class=\"[^\"]*(?:flex|grid|px-|py-|text-sm|bg-)\b"],
        "Webflow": [r"webflow\.com", r"wf-page", r"w-dyn-list"],
        "Framer / Motion": [r"framer-motion", r"data-projection-id", r"framer\.com"],
    },
    "cloud_and_hosting": {
        "Cloudflare Enterprise / CDN": [r"cf-ray", r"cloudflare", r"__cfduid"],
        "Vercel Edge Network": [r"x-vercel-id", r"vercel\.app", r"_vercel"],
        "AWS (Amazon Web Services)": [r"amazonaws\.com", r"x-amz-", r"cloudfront\.net"],
        "Google Cloud Platform (GCP)": [r"googleapis\.com", r"googleusercontent\.com", r"appspot\.com"],
        "Netlify": [r"x-nf-request-id", r"netlify\.com"],
        "Fastly CDN": [r"fastly-restarts", r"x-fastly"],
    },
    "analytics_and_tooling": {
        "PostHog Analytics": [r"posthog\.com", r"app\.posthog\.com"],
        "Segment CDP": [r"cdn\.segment\.com", r"analytics\.js"],
        "Google Analytics 4 / GTM": [r"googletagmanager\.com", r"google-analytics\.com", r"gtag\("],
        "Mixpanel Product Analytics": [r"cdn\.mxpnl\.com", r"mixpanel\.track"],
        "Datadog APM & Logs": [r"datadoghq-browser-agent", r"dd-rum"],
        "Sentry Error Tracking": [r"browser\.sentry-cdn\.com", r"sentry\.io"],
        "Intercom Messenger": [r"widget\.intercom\.io", r"intercomSettings"],
        "HubSpot CRM": [r"js\.hs-scripts\.com", r"hubspot\.net"],
        "Hotjar Behavior Heatmaps": [r"static\.hotjar\.com", r"hotjar\.com"],
    },
    "payments_and_monetization": {
        "Stripe Payments": [r"js\.stripe\.com", r"stripe\.com"],
        "Razorpay Gateway": [r"checkout\.razorpay\.com", r"razorpay\.com"],
        "Paddle Billing": [r"cdn\.paddle\.com", r"paddle\.js"],
        "PayPal": [r"paypalobjects\.com", r"paypal\.com"],
        "Lemon Squeezy": [r"assets\.lemonsqueezy\.com", r"lemonsqueezy"],
    },
    "ai_and_search": {
        "OpenAI / GPT Integration": [r"api\.openai\.com", r"openai"],
        "Anthropic Claude API": [r"anthropic", r"claude\.ai"],
        "Algolia AI Search": [r"algoliasearch", r"algolia\.net"],
        "Pinecone Vector Database": [r"pinecone\.io"],
        "LangChain / LlamaIndex": [r"langchain", r"llamaindex"],
        "AI Chat Assistant / Agent": [r"chatbot", r"copilot", r"ai-assistant"],
    }
}

class TechDetector:
    """Detects technologies and frameworks from live website responses & headers."""

    async def detect_technologies(self, url: str) -> Dict[str, List[str]]:
        results = {
            "frontend": [],
            "cloud_and_infra": [],
            "analytics_and_tooling": [],
            "payments_and_monetization": [],
            "ai_and_search": []
        }

        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                resp = await client.get(url)
                html = resp.text
                headers_str = str(resp.headers).lower()
                cookies_str = str(resp.cookies).lower()
                combined_target = f"{html}\n{headers_str}\n{cookies_str}"

                for category, frameworks in TECH_SIGNATURES.items():
                    for name, patterns in frameworks.items():
                        for pat in patterns:
                            if re.search(pat, combined_target, re.IGNORECASE):
                                if name not in results[category]:
                                    results[category].append(name)
                                break

        except Exception as e:
            logger.debug(f"Tech detection note for {url}: {e}")

        return results

tech_detector = TechDetector()
