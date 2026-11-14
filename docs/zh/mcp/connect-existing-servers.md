---
id: "connect-existing-mcp"
title: "桥接已有 MCP 服务"
description: "区分 stdio、SSE 与 Streamable HTTP，把现有服务连接到智能体。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-28"]
---

# 桥接已有 MCP 服务

已经有 MCP 服务时，不必再把它改写成另一个工具程序。先确定它的传输方式和独立运行结果，再接入小智端点。

## 开始前 {#scope}

先完成[MCP 快速开始](./quickstart)，确认自己的小智端点能接入一个最小工具。本页沿用其中固定提交的 `mcp_pipe.py` 和 Python 环境，区别在于它读取多个服务的配置。

| 服务类型 | 连接信息 |
| --- | --- |
| stdio | 本机命令、参数、工作文件及环境变量 |
| SSE | 服务明确提供的 SSE URL 与所需鉴权 |
| Streamable HTTP | 服务明确提供的 HTTP MCP URL 与所需鉴权 |

普通 REST API 或 WebSocket 地址不能仅靠改 `type` 就变成 MCP 服务。

## 1. 先独立验证服务 {#standalone}

使用服务维护者支持的 MCP 客户端或测试方法确认 `initialize`、工具发现和一次调用成功。固定软件版本，知道它会访问哪些文件、设备或远端账号。

本地文件工具只开放需要的目录；Home Assistant 等服务的令牌只授予所需范围。不要直接复制含真实路径、Token 和管理员权限的整份别人的配置。

## 2. 建立配置 {#config}

在桥接目录创建 `mcp_config.json`。以下是结构示例，所有占位命令、路径和 URL 都要换成真实服务：

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

SSE 服务把 `type` 改为 `sse` 并使用它的真实地址。不能凭习惯猜 `/sse` 或 `/mcp` 路径；`disabled: true` 可用于暂时跳过一个服务。示例凭据仅在本地替换，不提交带真实密钥的配置。

## 3. 启动并分段检查 {#run}

在同一终端设置 `MCP_ENDPOINT` 后，不带脚本参数运行：

```sh
python mcp_pipe.py
```

该上游提交读取配置并为启用项建立桥接；HTTP/SSE 通过环境中安装的 `mcp-proxy` 连接。为了定位问题，先只开启一个服务，逐个验证再增加。

若带本地 Python 脚本参数，则按快速开始运行单脚本，不把配置项名字误当成脚本路径。

## 怎么确认完成 {#verify}

目标智能体发现预期工具，并在对话记录中实际调用成功。验证服务重启和断网恢复；不要以桌面客户端能列出工具代替小智端的调用结果。

## 第三方图形工具与素材 {#materials}

HyperChat、McpPipe 等工具可以管理网关和连接，具体安装与版本由作者维护。旧安装图、浏览器扩展和设备唤醒/重启补丁不再混入本篇公共流程；选型见[社区 MCP 工具](../community/mcp-tools)。


## 下一步 {#next}

搜索用例见[联网搜索](./examples/web-search)，固件内控制设备走[设备端 GPIO 工具](../development/mcp-gpio)。桥接行为以[本篇采用的上游版本](https://github.com/78/mcp-calculator/tree/c537f71d61fd73b47d6c8955b5df6d3721acf4e4)为准。
