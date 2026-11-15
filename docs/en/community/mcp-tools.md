---
id: community-mcp-tools
title: Community MCP tools and services
description: Find authors and maintenance links while separating general integration from third-party setup.
status: review
reviewedAt: '2026-11-15'
reviewNote: >-
  Third-party projects and prototypes have not all been tested. Check exact versions and hardware requirements before
  use.
sourceArticles:
  - DOC-43
  - DOC-26
  - DOC-27
  - DOC-28
translation:
  status: review
  sourceHash: bd3c54869ca3a90a5a8c633932e7e92958d9b98465cf2e4e5f5028d7978958e9
  reviewedAt: '2026-11-15'
---
# Community MCP tools and services

These community tools offer different maintenance options. They are not official services, and inclusion does not mean this site has run, audited, or guaranteed every external feature.

<a name="scope"></a>

## Choose a maintenance approach {#scope}

| Type | Suitable use | Check |
| --- | --- | --- |
| Local desktop launcher | Keep tools online on your Windows computer | Release source, dependencies, sleep, and process state |
| Self-hosted management platform | Manage multiple endpoints and services | Version, database, authentication, updates, and backups |
| Third-party hosted service | A provider keeps the service running | Credential use, cost, operator, and how to stop using it |

<a name="mcptools"></a>

## XiaoZhi MCPTools {#mcptools}

Author: **ZongZiTongXue (粽子同学)**. Project: [xiaozhi-MCPTools](https://github.com/ZongZiTongXue/xiaozhi-MCPTools). Read the author's release notes for the current version and distribution before installing.

The author maintains installation details. For permission or 401 errors, check release notes and authentication configuration. Verify the endpoint with the [official minimal example](../mcp/quickstart.md) first, and retain actual startup errors.

<a name="mcphub"></a>

## xiaozhi-mcphub {#mcphub}

Maintainer: **huangjunsen0406**. Project: [xiaozhi-mcphub](https://github.com/huangjunsen0406/xiaozhi-mcphub), covering multiple endpoints, groups, and service management.

<figure class="source-figure">

[![xiaozhi-mcphub tool marketplace. This is a service-selection interface, not a connection architecture diagram.](../../public/images/zh/doc-27-image-006.webp)](../../public/images/zh/doc-27-image-006.webp)

<figcaption>xiaozhi-mcphub tool marketplace. This is a service-selection interface, not a connection architecture diagram.</figcaption>
</figure>

Before self-hosting, read that version's README, pin the image/source version, change default credentials, and check database and backup arrangements.

<a name="bridge-tools"></a>

## HyperChat / McpPipe bridges {#bridge-tools}

HyperChat and McpPipe can manage graphical gateways and connectors. See [Connect existing services](../mcp/connect-existing-servers.md) for general stdio/SSE/HTTP integration. Follow the tools' maintainers for version-specific GUI instructions.

<a name="search"></a>

## Shanmao web search {#search}

Shanmao Technology provides hosted search. Before use, check its current HTTPS entry point, pricing, and operator, then decide whether to entrust your MCP credentials to it.

Use the [service maintenance instructions](https://my.feishu.cn/docx/DN0ndX1JaoP4EWx1FBWcdCmcnoc) to verify the current HTTPS address and operator. For a general search integration you can run yourself, see the [search example](../mcp/examples/web-search.md).

<SourceMaterials article="DOC-43" />

<a name="materials"></a>

## Before connecting {#materials}

Use the maintainer's current release and check permissions, dependencies, and how to exit. Remove MCP endpoints, API keys, and personal data before sharing configuration or screenshots.

<a name="verify"></a>

## Verify availability {#verify}

With your own account, verify endpoint connection → tool discovery → explicit invocation → correct result, then restart, network recovery, and shutdown. Share only redacted logs. Direct third-party issues to the corresponding maintainer.
