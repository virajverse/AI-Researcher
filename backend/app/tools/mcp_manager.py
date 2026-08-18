import json
import logging
from typing import Dict, Any, List
from app.tools.firecrawl_client import firecrawl_client
from app.tools.playwright_scraper import playwright_scraper

logger = logging.getLogger(__name__)

class MCPManager:
    """MCP Server manager bridging Firecrawl and Playwright tool specifications."""

    def __init__(self):
        self.registered_servers = {
            "firecrawl": {
                "name": "Firecrawl MCP",
                "description": "Clean web scraping and markdown conversion",
                "status": "ready"
            },
            "playwright": {
                "name": "Playwright MCP",
                "description": "Headless browser JS rendering and DOM extraction",
                "status": "ready"
            }
        }

    def get_server_status(self) -> Dict[str, Any]:
        return self.registered_servers

    async def execute_mcp_tool(self, server: str, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Execute tool dynamically across registered MCP servers."""
        if server == "firecrawl":
            if tool_name in ["scrape_url", "scrape"]:
                return await firecrawl_client.scrape_url(arguments.get("url", ""))
            elif tool_name in ["crawl", "crawl_domain"]:
                return {"pages": await firecrawl_client.crawl_domain(arguments.get("url", ""))}
        elif server == "playwright":
            if tool_name in ["render_page", "extract"]:
                return await playwright_scraper.render_and_extract(arguments.get("url", ""))

        return {"error": f"Tool {tool_name} not found on server {server}"}

mcp_manager = MCPManager()
