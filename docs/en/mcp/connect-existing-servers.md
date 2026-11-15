---
id: connect-existing-mcp
title: Connect existing MCP services
description: 'Bridge stdio, SSE, or Streamable HTTP services to your agent.'
status: review
reviewedAt: '2026-11-15'
reviewNote: >-
  English translation checked against the current source. Technical and hardware verification limits are stated in the
  guide.
sourceArticles:
  - DOC-28
translation:
  status: review
  sourceHash: 57295cdf1e4ddc1d5cf5121b52cda4967f011a97bff029a0c65c9d680530d757
  reviewedAt: '2026-11-15'
---
# Connect existing MCP services

An existing MCP service does not need to be rewritten as another tool program. Identify its transport and verify it independently before connecting the XiaoZhi endpoint.

<a name="scope"></a>

## Before starting {#scope}

Complete the [MCP quickstart](./quickstart.md) and verify a minimal tool on your own endpoint. This guide reuses its pinned `mcp_pipe.py` commit and Python environment, but reads configuration for multiple services.

| Service type | Connection information |
| --- | --- |
| stdio | Local command, arguments, working files, and environment variables |
| SSE | The service's documented SSE URL and authentication |
| Streamable HTTP | The service's documented HTTP MCP URL and authentication |

Changing `type` does not turn an ordinary REST API or WebSocket address into an MCP service.

<figure class="source-figure">

[![Choose the correct transport for an existing MCP service.](../../public/images/en/mcp-transport-choice.svg)](../../public/images/en/mcp-transport-choice.svg)

<figcaption>Choose the correct transport for an existing MCP service. Click to view full size.</figcaption>
</figure>

<a name="standalone"></a>

## 1. Verify the service independently {#standalone}

Use the maintainer's supported MCP client or test method to verify `initialize`, tool discovery, and one successful call. Pin the software version and understand which files, devices, or remote accounts it can access.

For local file tools, expose only required directories. Give Home Assistant and similar tokens only the required scope. Do not copy someone else's full configuration with real paths, tokens, and administrative permissions.

<a name="config"></a>

## 2. Create configuration {#config}

Create `mcp_config.json` in the bridge directory. This is a structural example; replace every placeholder command, path, and URL with an actual service:

```json
{
  "mcpServers": {
    "local-tool": {
      "type": "stdio",
      "command": "python",
      "args": ["/absolute/path/to/your_server.py"]
    },
    "remote-tool": {
      "type": "http",
      "url": "https://mcp.example.com/mcp",
      "headers": {"Authorization": "Bearer REPLACE_LOCALLY"}
    }
  }
}
```

For SSE, use `type: "sse"` and the actual service URL. Do not guess `/sse` or `/mcp` paths. Set `disabled: true` to temporarily skip a service. Replace credentials locally and do not commit real secrets.

<a name="run"></a>

## 3. Start and check each stage {#run}

Set `MCP_ENDPOINT` in the same terminal, then run without a script argument:

```sh
python mcp_pipe.py
```

This upstream commit reads the configuration and creates bridges for enabled entries. HTTP/SSE connections use `mcp-proxy` installed in the environment. Enable one service at a time to isolate problems.

Passing a local Python script instead runs a single script as in the quickstart. A configuration entry's name is not a script path.

<a name="verify"></a>

## Verify the result {#verify}

The target agent should discover the expected tools and actually invoke them successfully in conversation records. Test service restart and network recovery. Discovery in a desktop client alone does not verify invocation from XiaoZhi.

<a name="materials"></a>

## Third-party graphical tools {#materials}

HyperChat, McpPipe, and other tools can manage gateways and connections. Their authors maintain installation and version details. See [Community MCP tools](../community/mcp-tools.md).

<a name="next"></a>

## Next steps {#next}

See [Web search](./examples/web-search.md) for search, or [Device GPIO tools](../development/mcp-gpio.md) for control inside firmware. Bridge behavior is defined by the [upstream version used here](https://github.com/78/mcp-calculator/tree/c537f71d61fd73b47d6c8955b5df6d3721acf4e4).
