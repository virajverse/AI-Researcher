import asyncio
import logging
import re
import urllib.parse
import warnings
warnings.filterwarnings("ignore")

from typing import List, Dict, Any, Optional
import httpx
from bs4 import BeautifulSoup

try:
    from ddgs import DDGS
except ImportError:
    from duckduckgo_search import DDGS

logger = logging.getLogger(__name__)

class WebSearchEngine:
    """
    Multi-Source Real Search Engine with Google Search as Primary.
    Features:
    - Primary: Direct Google Search Scraper with SERP HTML parsing
    - News: Google News Feed Aggregator
    - Fallback: DuckDuckGo / HTML Fallback
    """

    def __init__(self):
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": '"Windows"',
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1"
        }

    async def search(self, query: str, max_results: int = 6) -> List[Dict[str, str]]:
        """Primary search method: Try Google first, then DuckDuckGo fallback."""
        # 1. Try Google Search Scraper
        google_results = await self._scrape_google_search(query, max_results)
        if google_results and len(google_results) >= 2:
            return google_results

        # 2. Try DuckDuckGo
        ddg_results = await self._search_duckduckgo(query, max_results)
        if ddg_results:
            return ddg_results

        return google_results or []

    async def _scrape_google_search(self, query: str, max_results: int = 6) -> List[Dict[str, str]]:
        """Direct Google Search Scraper."""
        results = []
        encoded_query = urllib.parse.quote_plus(query)
        url = f"https://www.google.com/search?q={encoded_query}&num={max_results + 3}&hl=en&gl=us"

        try:
            async with httpx.AsyncClient(timeout=12.0, headers=self.headers, follow_redirects=True) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    soup = BeautifulSoup(resp.text, "html.parser")
                    
                    # Parse standard Google Search Result Containers
                    containers = soup.find_all("div", class_=["g", "tF2Cxc", "MjjYud"])
                    for c in containers:
                        a_tag = c.find("a", href=True)
                        h3_tag = c.find("h3") or c.find("h2")
                        
                        # Snippet finding across various Google DOM classes
                        snippet_div = (
                            c.find("div", class_=["VwiC3b", "yXK7lf", "MUxGbd", "s3v9rd"]) or
                            c.find("div", class_="IsZvec") or
                            c.find("span", class_="aCOpRe")
                        )

                        if a_tag and h3_tag:
                            href = a_tag["href"]
                            # Clean google redirects if present (/url?q=...)
                            if href.startswith("/url?q="):
                                href = href.split("/url?q=")[1].split("&")[0]
                                href = urllib.parse.unquote(href)

                            if href.startswith("http") and "google.com" not in href and "youtube.com" not in href:
                                title = h3_tag.get_text(strip=True)
                                snippet = snippet_div.get_text(separator=" ", strip=True) if snippet_div else ""

                                if title and not any(r["url"] == href for r in results):
                                    results.append({
                                        "title": title,
                                        "url": href,
                                        "snippet": snippet
                                    })
                                    if len(results) >= max_results:
                                        break
        except Exception as e:
            logger.debug(f"Google search scraper note: {e}")

        return results

    async def _search_duckduckgo(self, query: str, max_results: int = 6) -> List[Dict[str, str]]:
        """DuckDuckGo secondary search engine."""
        collected = []
        try:
            loop = asyncio.get_event_loop()
            collected = await loop.run_in_executor(
                None,
                lambda: self._sync_ddg(query, max_results)
            )
        except Exception as e:
            logger.debug(f"DDG fallback search: {e}")
        return collected

    def _sync_ddg(self, query: str, max_results: int) -> List[Dict[str, str]]:
        collected = []
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                with DDGS() as ddgs:
                    for r in ddgs.text(query, max_results=max_results):
                        collected.append({
                            "title": r.get("title", ""),
                            "url": r.get("href", ""),
                            "snippet": r.get("body", "")
                        })
        except Exception:
            pass
        return collected

    async def search_company_matrix(self, company_name: str, domain: Optional[str] = None) -> Dict[str, List[Dict[str, str]]]:
        """Execute parallel deep forensic multi-dimensional search queries with Google."""
        clean_name = company_name.strip()
        target_domain = f"site:{domain}" if domain and not any(p in domain for p in ["microsoft.com", "google.com", "apple.com"]) else ""

        queries = {
            "basic_dna": f'"{clean_name}" (founders OR directors OR "CEO" OR "incorporated" OR zaubacorp OR tofler OR linkedin) {target_domain}'.strip(),
            "origin_and_history": f'"{clean_name}" (origin OR history OR "about us" OR story OR founded date OR headquarters)'.strip(),
            "business_model": f'"{clean_name}" (services OR products OR "what we do" OR pricing OR clients OR portfolio) {target_domain}'.strip(),
            "product_sentiment": f'"{clean_name}" (reviews OR feedback OR complaints OR rating OR glassdoor OR ambitionbox)'.strip(),
            "tech_stack": f'"{clean_name}" (technologies OR "tech stack" OR python OR react OR AI OR cloud OR development)'.strip(),
            "strategy": f'"{clean_name}" (crunchbase OR cbinsights OR funding OR expansion OR registration OR growth)'.strip(),
            "competitors": f'"{clean_name}" (competitors OR alternatives OR similar companies OR market)'.strip(),
            "news_and_social": f'"{clean_name}" (linkedin OR instagram OR twitter OR news OR press)'.strip()
        }

        tasks = {k: self.search(q, max_results=6) for k, q in queries.items()}
        matrix_results = {}

        results_list = await asyncio.gather(*tasks.values(), return_exceptions=True)
        for key, res in zip(tasks.keys(), results_list):
            if isinstance(res, list):
                matrix_results[key] = res
            else:
                matrix_results[key] = []

        return matrix_results

web_search_engine = WebSearchEngine()
