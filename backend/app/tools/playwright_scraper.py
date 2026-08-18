import asyncio
import logging
from typing import Dict, Any, Optional
from playwright.async_api import async_playwright
from app.config import settings

logger = logging.getLogger(__name__)

class PlaywrightScraper:
    """Headless Playwright browser scraper for JavaScript-heavy sites, SPAs & screenshots."""

    def __init__(self):
        self.timeout = settings.PLAYWRIGHT_TIMEOUT
        self.headless = settings.HEADLESS

    async def render_and_extract(self, url: str, take_screenshot: bool = False) -> Dict[str, Any]:
        """Load page in Chromium, wait for hydration, extract rendered HTML & metadata."""
        result = {
            "url": url,
            "title": "",
            "rendered_text": "",
            "meta_description": "",
            "links": [],
            "screenshot_base64": None,
            "success": False
        }

        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=self.headless)
                context = await browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    viewport={"width": 1280, "height": 800}
                )
                page = await context.new_page()

                try:
                    await page.goto(url, wait_until="domcontentloaded", timeout=self.timeout)
                    await page.wait_for_timeout(2000) # Allow hydration

                    result["title"] = await page.title()

                    # Extract meta description
                    desc_elem = await page.query_selector('meta[name="description"]') or await page.query_selector('meta[property="og:description"]')
                    if desc_elem:
                        result["meta_description"] = await desc_elem.get_attribute("content") or ""

                    # Extract clean inner text
                    body_text = await page.evaluate("""() => {
                        const clone = document.body.cloneNode(true);
                        const removeSelectors = ['script', 'style', 'nav', 'footer', 'noscript', 'svg', 'iframe'];
                        removeSelectors.forEach(sel => {
                            clone.querySelectorAll(sel).forEach(el => el.remove());
                        });
                        return clone.innerText;
                    }""")

                    result["rendered_text"] = body_text[:15000] if body_text else ""

                    # Extract navigation & relevant sublinks
                    links = await page.evaluate("""() => {
                        return Array.from(document.querySelectorAll('a[href]'))
                            .map(a => ({ text: a.innerText.trim(), href: a.href }))
                            .filter(l => l.text.length > 2 && !l.href.startsWith('javascript:'))
                            .slice(0, 30);
                    }""")
                    result["links"] = links

                    result["success"] = True
                except Exception as e:
                    logger.warning(f"Playwright navigation issue for {url}: {e}")
                    result["error"] = str(e)
                finally:
                    await browser.close()

        except Exception as e:
            logger.error(f"Playwright engine failure: {e}")
            result["error"] = str(e)

        return result

playwright_scraper = PlaywrightScraper()
