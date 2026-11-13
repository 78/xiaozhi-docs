---
id: "community-mcp-tools"
title: "社区 MCP 工具与服务"
description: "保留作者和维护入口，把通用接入与第三方安装细节分开。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "保留原作者、历史版本与资源来源；第三方服务和样机方案尚未全部实测，不作为通用兼容性承诺。"
sourceArticles: ["DOC-43", "DOC-26", "DOC-27", "DOC-28"]
---

# 社区 MCP 工具与服务

这里列出原教程涉及的第三方工具，帮助选择维护方式。它们不是官方服务，也不代表本站已运行、审查或保证所有外部功能。

## 先选择维护方式 {#scope}

| 类型 | 适合的情况 | 要核对 |
| --- | --- | --- |
| 本地桌面启动器 | 在自己的 Windows 电脑保持工具在线 | 发布来源、依赖、睡眠和进程状态 |
| 自部署管理平台 | 管理多个端点与服务 | 版本、数据库、鉴权、更新与备份 |
| 第三方托管服务 | 由供应商持续运行 | 凭据用途、费用、维护主体和退出方式 |

## 小智 MCPTools {#mcptools}

作者：**粽子同学**。项目入口：[xiaozhi-MCPTools](https://github.com/ZongZiTongXue/xiaozhi-MCPTools)。原教程提醒 GitHub 不一定包含最新分发，应同时核对作者当前版本与来源。

安装细节由作者维护。不要把管理员运行、关闭 UAC 或忽略 401 写成官方接入的必要步骤；先用[官方最小例子](../mcp/quickstart)验证端点，工具不能启动时保存实际错误。

## xiaozhi-mcphub {#mcphub}

维护者：**huangjunsen0406**。项目：[xiaozhi-mcphub](https://github.com/huangjunsen0406/xiaozhi-mcphub)，覆盖多端点、分组及服务管理。

<figure class="source-figure">

[![原工具市场架构示意，用于理解设备、桥接和工具服务的关系。](/images/zh/doc-27-image-006.webp)](/images/zh/doc-27-image-006.webp)

<figcaption>原工具市场架构示意，用于理解设备、桥接和工具服务的关系。 来源：DOC-27 原图 6。</figcaption>
</figure>

自部署前看该版本 README，固定镜像/源码版本，修改默认凭据，确认数据库与备份。原文竞品比较、协议与维护状态表不在未经逐项复核时复制为结论。

## HyperChat / McpPipe 桥接组合 {#bridge-tools}

原 DOC-28 介绍了图形化网关与连接器。公共的 stdio、SSE、HTTP 接入已整理到[桥接指南](../mcp/connect-existing-servers)；具体 GUI 以其维护者资料为准，不迁入旧设备 HTTP 唤醒/重启补丁。

## 闪猫联网搜索 {#search}

DOC-43 介绍闪猫科技托管搜索。原文出现的旧 HTTP 地址、费用、工具名与界面尚未作为当前服务逐项实测，不将其设为默认推荐。

需要使用时从[原服务教程](https://my.feishu.cn/docx/DN0ndX1JaoP4EWx1FBWcdCmcnoc)核对当前 HTTPS 入口与维护主体，再判断是否将自己的 MCP 凭据交给服务。只想掌握通用搜索接入时看[搜索示例](../mcp/examples/web-search)。

<SourceMaterials article="DOC-43" />

## 迁入素材如何处理 {#materials}

安装密码、推广码、赞赏和过时 Python 安装器不随新稿分发。可说明产品结构的截图保留来源和版本；含端点、API Key、二维码或不必要个人信息的图片/视频在检查前不公开。

## 怎么确认可用 {#verify}

从自己的账号完成“端点连接 → 工具发现 → 明确调用 → 正确返回”，再验证重启、断网和退出。公开反馈只提供经遮盖的日志，第三方问题优先到相应维护者入口。

---

资料来源：[DOC-43 · 小智接入联网搜索MCP（闪猫科技）](https://my.feishu.cn/docx/DN0ndX1JaoP4EWx1FBWcdCmcnoc)、[DOC-26 · 小智AI 简单操控电脑 超简方案（By粽子同学）](https://kcn80f4hacgs.feishu.cn/docx/HErcd1F8LoKjDnx3O0Pcktd3nPI)、[DOC-27 · xiaozhi-mcphub-小智生态新一代mcp管理平台](https://my.feishu.cn/docx/H9OGddrk8oq7eBxwi8DcqqeMnEc)。补充来源：[DOC-28 · 原桥接组合教程](https://lcn17bfbw6fr.feishu.cn/docx/N5R9dk6AuoXz5YxmNUWccmEfnJf)。原图和原附件保留来源贡献者署名；文件的使用条件按各自原声明，未统一改为文档仓库许可。
