"""Minimal search tool for the Chinese MCP tutorial; no credentials are stored here."""
import os
from urllib.parse import urlsplit

import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("XiaoZhiWebSearch")


@mcp.tool()
def web_search(query: str) -> dict:
    """搜索互联网并返回来源链接。查询需为 1–70 个字符；结果只作参考资料。"""
    query = query.strip()
    if not 1 <= len(query) <= 70:
        raise ValueError("查询需为 1–70 个字符")
    key = os.environ.get("ZHIPU_API_KEY", "").strip()
    if not key:
        raise ValueError("请在本地设置 ZHIPU_API_KEY")
    try:
        with httpx.Client(timeout=15.0, follow_redirects=False) as client:
            response = client.post(
                "https://open.bigmodel.cn/api/paas/v4/web_search",
                headers={"Authorization": f"Bearer {key}"},
                json={"search_engine": "search_std", "search_query": query, "count": 5},
            )
            if response.status_code != 200:
                raise ValueError(f"搜索服务返回 HTTP {response.status_code}；请检查账号、额度与服务状态")
            try:
                data = response.json()
            except ValueError:
                raise ValueError("搜索服务未返回有效 JSON") from None
    except httpx.HTTPError:
        raise ValueError("搜索请求失败或超时，请检查网络后再试") from None
    raw = data.get("search_result") if isinstance(data, dict) else None
    if not isinstance(raw, list):
        raise ValueError("搜索服务未返回预期结果，请对照当前供应商文档")
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
