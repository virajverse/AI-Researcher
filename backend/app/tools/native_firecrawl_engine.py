import asyncio
import re
import json
import logging
from urllib.parse import urljoin, urlparse
from typing import Dict, Any, List, Optional, Set
from bs4 import BeautifulSoup, Comment, Tag
try:
    from playwright.async_api import async_playwright
except ImportError:
    async_playwright = None
import httpx

from app.config import settings

logger = logging.getLogger(__name__)

PRIORITY_PATHS = [
    "",
    "/about",
    "/about-us",
    "/company",
    "/pricing",
    "/plans",
    "/product",
    "/products",
    "/features",
    "/customers",
    "/case-studies",
    "/team",
    "/leadership",
    "/careers",
    "/security",
    "/enterprise",
    "/docs"
]

class NativeFirecrawlEngine:
    """
    100% Built-In, Local Firecrawl-Grade Web Scraping & Crawling Engine.
    Features:
    - Headless Chromium with JavaScript hydration and anti-detection
    - Semantic Readability & Noise Removal (strips ads, cookies, popups, navbars, footers)
    - Pristine HTML-to-Markdown conversion (Tables, Code blocks, Headings, Lists)
    - Microdata & JSON-LD schema extraction (Founders, Organization, Social profiles)
    - Recursive Site Crawling & Priority Sub-path Discovery
    """

    def __init__(self):
        self.headless = settings.HEADLESS
        self.timeout = settings.PLAYWRIGHT_TIMEOUT
        self.user_agent = (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )

    async def scrape(self, url: str) -> Dict[str, Any]:
        """
        Deep forensic scrape of a single URL.
        Renders dynamic JS in Playwright, extracts structured metadata, and converts to clean Markdown.
        """
        parsed = urlparse(url)
        if not parsed.scheme:
            url = f"https://{url}"

        # Try Playwright Headless Chromium first for dynamic JS/SPA hydration
        try:
            return await self._playwright_scrape(url)
        except Exception as e:
            logger.warning(f"Playwright scrape failed for {url}: {e}. Trying Fast Async HTTP Engine.")
            return await self._http_scrape(url)

    async def crawl(self, base_url: str, max_pages: int = 6) -> List[Dict[str, Any]]:
        """
        Autonomous Multi-Page Crawler.
        Discovers and deep-scrapes high-value company subpages in parallel.
        """
        parsed = urlparse(base_url)
        if not parsed.scheme:
            base_url = f"https://base_url"
        
        origin = f"{parsed.scheme or 'https'}://{parsed.netloc or parsed.path.split('/')[0]}"
        clean_origin = origin.rstrip("/")

        visited: Set[str] = set()
        crawled_results: List[Dict[str, Any]] = []

        # 1. Scrape Homepage first
        homepage_data = await self.scrape(clean_origin)
        if homepage_data.get("success"):
            visited.add(clean_origin)
            visited.add(f"{clean_origin}/")
            crawled_results.append(homepage_data)

        # 2. Extract discovered internal links from homepage
        discovered_internal = []
        for link in homepage_data.get("links", []):
            href = link.get("href", "")
            if href and (href.startswith("/") or clean_origin in href):
                full_url = urljoin(clean_origin, href).split("#")[0].rstrip("/")
                if full_url not in visited and clean_origin in full_url:
                    discovered_internal.append(full_url)

        # 3. Combine priority paths + discovered links
        candidate_urls = []
        for path in PRIORITY_PATHS:
            target = f"{clean_origin}{path}"
            if target not in visited and target not in candidate_urls:
                candidate_urls.append(target)

        for disc in discovered_internal:
            if disc not in visited and disc not in candidate_urls:
                candidate_urls.append(disc)

        # Crawl priority pages concurrently (up to limit)
        targets_to_crawl = candidate_urls[:max_pages]
        tasks = [self.scrape(u) for u in targets_to_crawl]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for r in results:
            if isinstance(r, dict) and r.get("success") and len(r.get("markdown", "")) > 150:
                crawled_results.append(r)

        return crawled_results

    async def _playwright_scrape(self, url: str) -> Dict[str, Any]:
        """Playwright Chromium Browser Scraper with DOM hydration & JS evaluation."""
        if async_playwright is None:
            raise RuntimeError("Playwright not installed in environment (Running in Serverless mode)")
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=self.headless,
                args=["--disable-blink-features=AutomationControlled"]
            )
            context = await browser.new_context(
                user_agent=self.user_agent,
                viewport={"width": 1440, "height": 900},
                java_script_enabled=True
            )
            page = await context.new_page()

            # Anti-detection stealth headers
            await page.set_extra_http_headers({
                "Accept-Language": "en-US,en;q=0.9",
                "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"'
            })

            try:
                response = await page.goto(url, wait_until="domcontentloaded", timeout=self.timeout)
                # Wait briefly for dynamic React/Next.js/Vue hydration
                await page.wait_for_timeout(1500)

                # Scroll down slightly to trigger lazy-loaded sections
                await page.evaluate("window.scrollBy(0, 800)")
                await page.wait_for_timeout(500)

                html = await page.content()
                page_title = await page.title()
                final_url = page.url

                return self._parse_html_to_clean_data(html, final_url, page_title, engine_name="native_playwright_firecrawl")
            finally:
                await browser.close()

    async def _http_scrape(self, url: str) -> Dict[str, Any]:
        """Fast HTTP Fallback Scraper."""
        headers = {
            "User-Agent": self.user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
        async with httpx.AsyncClient(timeout=15.0, headers=headers, follow_redirects=True) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            title = soup.title.get_text(strip=True) if soup.title else url
            return self._parse_html_to_clean_data(resp.text, str(resp.url), title, engine_name="native_http_firecrawl")

    def _parse_html_to_clean_data(self, html: str, url: str, page_title: str, engine_name: str) -> Dict[str, Any]:
        """
        Firecrawl-grade DOM sanitizer and pristine markdown generator.
        """
        soup = BeautifulSoup(html, "html.parser")

        # 1. Extract Schema.org JSON-LD structured data
        json_ld_data = []
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                if script.string:
                    json_ld_data.append(json.loads(script.string))
            except Exception:
                pass

        # 2. Extract Metadata (OpenGraph, Twitter Cards, Description, Keywords)
        metadata = {
            "title": page_title,
            "url": url,
            "description": "",
            "og_title": "",
            "og_description": "",
            "og_image": "",
            "twitter_card": "",
            "json_ld": json_ld_data
        }

        desc_tag = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
        if desc_tag and desc_tag.get("content"):
            metadata["description"] = desc_tag["content"]

        og_title = soup.find("meta", attrs={"property": "og:title"})
        if og_title and og_title.get("content"):
            metadata["og_title"] = og_title["content"]

        # 3. Extract Links & Social Footprints
        links = []
        social_links = {}
        for a in soup.find_all("a", href=True):
            href = a["href"].strip()
            text = a.get_text(strip=True)
            if not href or href.startswith("javascript:") or href.startswith("mailto:"):
                continue

            full_href = urljoin(url, href)
            links.append({"text": text, "href": full_href})

            # Check social
            if "linkedin.com" in full_href:
                social_links["linkedin"] = full_href
            elif "twitter.com" in full_href or "x.com" in full_href:
                social_links["twitter"] = full_href
            elif "github.com" in full_href:
                social_links["github"] = full_href
            elif "crunchbase.com" in full_href:
                social_links["crunchbase"] = full_href

        metadata["social_links"] = social_links

        # 4. Firecrawl-Style Boilerplate & Noise Elimination
        # Decompose elements that are useless for company intelligence
        unwanted_selectors = [
            "script", "style", "noscript", "svg", "canvas", "iframe",
            "nav", "footer", "header", ".cookie-banner", ".cookie-consent",
            "#onetrust-banner-sdk", ".intercom-lightweight-app", "#hubspot-messages-iframe-container",
            ".modal", ".popup", "[role='dialog']", ".advertisement", ".ad-banner"
        ]
        for sel in unwanted_selectors:
            for el in soup.select(sel):
                el.decompose()

        # Remove HTML comments
        for comment in soup.find_all(text=lambda text: isinstance(text, Comment)):
            comment.extract()

        # 5. Semantic HTML to Markdown Converter
        markdown_content = self._convert_soup_to_markdown(soup, page_title, metadata["description"])

        return {
            "url": url,
            "title": page_title,
            "markdown": markdown_content,
            "metadata": metadata,
            "links": links[:40],
            "success": True,
            "engine": engine_name
        }

    def _convert_soup_to_markdown(self, soup: BeautifulSoup, title: str, description: str) -> str:
        """Converts cleaned DOM structure into beautiful, dense, structured Markdown."""
        md_lines = [f"# {title}"]
        if description:
            md_lines.append(f"> {description}\n")

        main_content = soup.find("main") or soup.find("article") or soup.find("body") or soup

        for elem in main_content.find_all(["h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "table", "pre", "blockquote"], recursive=True):
            name = elem.name
            text = elem.get_text(separator=" ", strip=True)
            if not text or len(text) < 3:
                continue

            if name == "h1":
                md_lines.append(f"\n# {text}\n")
            elif name == "h2":
                md_lines.append(f"\n## {text}\n")
            elif name == "h3":
                md_lines.append(f"\n### {text}\n")
            elif name == "h4":
                md_lines.append(f"\n#### {text}\n")
            elif name == "p":
                md_lines.append(f"{text}\n")
            elif name in ["ul", "ol"]:
                for li in elem.find_all("li", recursive=False):
                    li_text = li.get_text(separator=" ", strip=True)
                    if li_text:
                        md_lines.append(f"- {li_text}")
                md_lines.append("")
            elif name == "blockquote":
                md_lines.append(f"> {text}\n")
            elif name == "pre":
                md_lines.append(f"```\n{text}\n```\n")
            elif name == "table":
                # Convert HTML Table to Markdown Table
                table_md = self._table_to_markdown(elem)
                if table_md:
                    md_lines.append(table_md)

        full_md = "\n".join(md_lines)
        # Collapse multiple blank lines
        full_md = re.sub(r"\n{3,}", "\n\n", full_md)
        return full_md[:25000]

    def _table_to_markdown(self, table_tag: Tag) -> str:
        """Convert HTML Table tag to GitHub-Flavored Markdown table."""
        rows = table_tag.find_all("tr")
        if not rows:
            return ""

        table_lines = []
        header_parsed = False

        for row in rows:
            headers = [th.get_text(strip=True) for th in row.find_all("th")]
            if headers and not header_parsed:
                table_lines.append("| " + " | ".join(headers) + " |")
                table_lines.append("| " + " | ".join(["---"] * len(headers)) + " |")
                header_parsed = True
                continue

            cols = [td.get_text(separator=" ", strip=True) for td in row.find_all(["td", "th"])]
            if cols:
                if not header_parsed:
                    # Synthetic header if table has no <th>
                    table_lines.append("| " + " | ".join([f"Col {i+1}" for i in range(len(cols))]) + " |")
                    table_lines.append("| " + " | ".join(["---"] * len(cols)) + " |")
                    header_parsed = True
                table_lines.append("| " + " | ".join(cols) + " |")

        return "\n" + "\n".join(table_lines) + "\n" if table_lines else ""

native_firecrawl = NativeFirecrawlEngine()
