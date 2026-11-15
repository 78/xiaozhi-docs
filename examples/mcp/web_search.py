"""Minimal search tool for the XiaoZhi MCP tutorial; no credentials are stored here."""
import os
from urllib.parse import urlsplit

import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("XiaoZhiWebSearch")


@mcp.tool()
def web_search(query: str) -> dict:
    """Search the web and return source links. Queries must be 1–70 characters; results are reference material."""
    query = query.strip()
    if not 1 <= len(query) <= 70:
        raise ValueError("Query must contain 1–70 characters")
    key = os.environ.get("ZHIPU_API_KEY", "").strip()
    if not key:
        raise ValueError("Set ZHIPU_API_KEY in your local environment")
    try:
        with httpx.Client(timeout=15.0, follow_redirects=False) as client:
            response = client.post(
                "https://open.bigmodel.cn/api/paas/v4/web_search",
                headers={"Authorization": f"Bearer {key}"},
                json={"search_engine": "search_std", "search_query": query, "count": 5},
            )
            if response.status_code != 200:
                raise ValueError(f"Search service returned HTTP {response.status_code}; check account, quota, and service status")
            try:
                data = response.json()
            except ValueError:
                raise ValueError("Search service did not return valid JSON") from None
    except httpx.HTTPError:
        raise ValueError("Search request failed or timed out; check the network and retry") from None
    raw = data.get("search_result") if isinstance(data, dict) else None
    if not isinstance(raw, list):
        raise ValueError("Unexpected search response; check current provider documentation")
    results = []
    for item in raw[:5]:
        if not isinstance(item, dict):
            continue
        link = str(item.get("link", ""))
        try:
            parsed = urlsplit(link)
        except ValueError:
            continue
        if parsed.scheme not in {"http", "https"} or not parsed.hostname or parsed.username:
            continue
        results.append({"title": str(item.get("title", ""))[:200], "url": link[:2048],
                        "summary": str(item.get("content", ""))[:400],
                        "date": str(item.get("publish_date", ""))[:32]})
    return {"results": results}


if __name__ == "__main__":
    mcp.run(transport="stdio")
