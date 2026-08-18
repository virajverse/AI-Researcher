import httpx
import logging
from typing import Optional, Dict, Any, List
from app.config import settings
from bs4 import BeautifulSoup
import re

logger = logging.getLogger(__name__)

class FirecrawlClient:
    """Firecrawl API & Clean Markdown Extractor Connector."""

    def __init__(self, api_key: Optional[str] = None, api_url: Optional[str] = None):
        self.api_key = api_key or settings.FIRECRAWL_API_KEY
        self.api_url = api_url or settings.FIRECRAWL_API_URL
        self.headers = {
            "Content-Type": "application/json"
        }
        if self.api_key:
            self.headers["Authorization"] = f"Bearer {self.api_key}"

    async def scrape_url(self, url: str) -> Dict[str, Any]:
        """Scrape a single URL using Firecrawl if configured, or clean internal scraper."""
        if self.api_key:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"{self.api_url}/scrape",
                        headers=self.headers,
                        json={
                            "url": url,
                            "pageOptions": {"onlyMainContent": True}
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        return {
                            "markdown": data.get("data", {}).get("markdown", ""),
                            "metadata": data.get("data", {}).get("metadata", {}),
                            "success": True,
                            "engine": "firecrawl_api"
                        }
            except Exception as e:
                logger.warning(f"Firecrawl API scrape failed: {e}. Falling back to internal engine.")

        # Built-in High Quality Fallback Markdown Scraper
        return await self._internal_scrape_to_markdown(url)

    async def crawl_domain(self, base_url: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Crawl key pages of a domain (/about, /pricing, /customers, /team, /careers)."""
        clean_base = base_url.rstrip("/")
        sub_paths = ["", "/about", "/pricing", "/customers", "/team", "/careers", "/product"]
        
        pages = []
        for path in sub_paths[:limit]:
            target = f"{clean_base}{path}" if path else clean_base
            page_data = await self.scrape_url(target)
            if page_data.get("markdown") and len(page_data.get("markdown", "")) > 100:
                pages.append({
                    "url": target,
                    "path": path or "/",
                    "markdown": page_data.get("markdown"),
                    "title": page_data.get("metadata", {}).get("title", path or "Homepage")
                })
        return pages

    async def _internal_scrape_to_markdown(self, url: str) -> Dict[str, Any]:
        """Internal clean markdown converter for web pages."""
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
        try:
            async with httpx.AsyncClient(timeout=15.0, headers=headers, follow_redirects=True) as client:
                resp = await client.get(url)
                if resp.status_code != 200:
                    return {"markdown": "", "metadata": {}, "success": False, "engine": "internal_failed"}

                soup = BeautifulSoup(resp.text, "html.parser")
                
                title = soup.title.get_text(strip=True) if soup.title else url
                meta_desc = ""
                desc_tag = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
                if desc_tag:
                    meta_desc = desc_tag.get("content", "")

                for tag in soup(["script", "style", "nav", "footer", "noscript", "svg", "button", "form", "iframe"]):
                    tag.decompose()

                markdown_lines = [f"# {title}", f"*{meta_desc}*", ""]

                # Extract headings and content blocks
                for elem in soup.find_all(["h1", "h2", "h3", "h4", "p", "li", "table"]):
                    text = elem.get_text(separator=" ", strip=True)
                    if not text or len(text) < 10:
                        continue
                    
                    if elem.name == "h1":
                        markdown_lines.append(f"\n# {text}\n")
                    elif elem.name == "h2":
                        markdown_lines.append(f"\n## {text}\n")
                    elif elem.name == "h3":
                        markdown_lines.append(f"\n### {text}\n")
                    elif elem.name == "li":
                        markdown_lines.append(f"- {text}")
                    elif elem.name == "table":
                        markdown_lines.append(f"\n[Table Data: {text[:300]}]\n")
                    else:
                        markdown_lines.append(text)

                clean_md = "\n\n".join(markdown_lines)
                clean_md = re.sub(r"\n{3,}", "\n\n", clean_md)

                return {
                    "markdown": clean_md[:12000],
                    "metadata": {
                        "title": title,
                        "description": meta_desc,
                        "url": str(resp.url)
                    },
                    "success": True,
                    "engine": "internal_markdown_extractor"
                }
        except Exception as e:
            logger.warning(f"Internal markdown scrape failed for {url}: {e}")
            return {"markdown": "", "metadata": {}, "success": False, "error": str(e), "engine": "internal_error"}

firecrawl_client = FirecrawlClient()
