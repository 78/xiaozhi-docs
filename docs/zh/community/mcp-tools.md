---
id: "community-mcp-tools"
title: "社区 MCP 工具与服务"
description: "保留作者和维护入口，把通用接入与第三方安装细节分开。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "第三方项目与样机尚未全部实测，使用前核对具体版本与硬件条件。"
sourceArticles: ["DOC-43", "DOC-26", "DOC-27", "DOC-28"]
---

# 社区 MCP 工具与服务

这里列出几种社区 MCP 工具，帮助选择维护方式。它们不是官方服务，也不代表本站已运行、审查或保证所有外部功能。

## 先选择维护方式 {#scope}

| 类型 | 适合的情况 | 要核对 |
| --- | --- | --- |
| 本地桌面启动器 | 在自己的 Windows 电脑保持工具在线 | 发布来源、依赖、睡眠和进程状态 |
| 自部署管理平台 | 管理多个端点与服务 | 版本、数据库、鉴权、更新与备份 |
| 第三方托管服务 | 由供应商持续运行 | 凭据用途、费用、维护主体和退出方式 |

## 小智 MCPTools {#mcptools}

作者：**粽子同学**。项目入口：[xiaozhi-MCPTools](https://github.com/ZongZiTongXue/xiaozhi-MCPTools)。安装前查看作者的发布说明，确认当前版本和分发入口。

安装细节由作者维护。不要把管理员运行、关闭 UAC 或忽略 401 写成官方接入的必要步骤；先用[官方最小例子](../mcp/quickstart)验证端点，工具不能启动时保存实际错误。

## xiaozhi-mcphub {#mcphub}

维护者：**huangjunsen0406**。项目：[xiaozhi-mcphub](https://github.com/huangjunsen0406/xiaozhi-mcphub)，覆盖多端点、分组及服务管理。

<figure class="source-figure">

[![原工具市场架构示意，用于理解设备、桥接和工具服务的关系。](/images/zh/doc-27-image-006.webp)](/images/zh/doc-27-image-006.webp)

<figcaption>原工具市场架构示意，用于理解设备、桥接和工具服务的关系。</figcaption>
</figure>

自部署前看该版本 README，固定镜像/源码版本，修改默认凭据，确认数据库与备份。

## HyperChat / McpPipe 桥接组合 {#bridge-tools}

HyperChat 与 McpPipe 可用于管理图形化网关和连接器。stdio、SSE、HTTP 的通用接入步骤见[桥接指南](../mcp/connect-existing-servers)，具体 GUI 操作按工具维护者的版本说明。

## 闪猫联网搜索 {#search}

闪猫科技提供托管搜索服务。使用前确认当前 HTTPS 入口、费用与维护主体，再决定是否交给它自己的 MCP 凭据。

需要使用时从[原服务教程](https://my.feishu.cn/docx/DN0ndX1JaoP4EWx1FBWcdCmcnoc)核对当前 HTTPS 入口与维护主体，再判断是否将自己的 MCP 凭据交给服务。只想掌握通用搜索接入时看[搜索示例](../mcp/examples/web-search)。

<SourceMaterials article="DOC-43" />

## 接入前检查 {#materials}

使用维护者的当前发行包，确认所需权限、依赖和退出方式。分享配置或截图前移除 MCP 端点、API Key 和个人信息。

## 怎么确认可用 {#verify}

从自己的账号完成“端点连接 → 工具发现 → 明确调用 → 正确返回”，再验证重启、断网和退出。公开反馈只提供经遮盖的日志，第三方问题优先到相应维护者入口。
