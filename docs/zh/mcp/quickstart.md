---
id: "mcp-quickstart"
title: "MCP 快速开始：接入一个计算工具"
description: "从安装依赖到工具发现，让智能体调用一个明确、可验证的本地加法工具。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "示例已通过本地 MCP 协议与 WebSocket 桥接测试；真实端点、控制台工具发现和设备语音调用仍需使用自己的账号验证。"
---

# MCP 快速开始：接入一个计算工具

本篇让一个本地加法工具出现在小智智能体中。先跑通“启动 → 连接 → 发现 → 调用”，再接文件、搜索或智能家居。

## 准备工作 {#scope}

- 已能正常对话的小智设备及其所属控制台账号。
- 一台能持续运行 Python 的电脑；本文使用 Python 3.12 和 Git。
- 能访问 GitHub、下载 Python 依赖并连接小智 MCP 端点的网络。

这里的工具运行在电脑上，**不是烧进 ESP32 固件**。电脑和桥接进程停止后，工具就不可用；完成开发后可按需要迁到持续在线的服务。

## 1. 获取当前智能体的端点 {#endpoint}

1. 登录[小智控制台](https://xiaozhi.me/console/)，找到设备所用的智能体。
2. 打开智能体配置，进入 **扩展能力**，展开 **MCP 接入点**。
3. 复制该智能体的 WebSocket 地址，后面只在自己的终端环境中使用。

端点是访问凭据。不要写进教程截图、Git 仓库或公开日志。重新展开可能生成新地址，但不代表旧地址自动失效；泄露时应通过当前服务提供的凭据管理/支持方式处理。

## 2. 建立独立 Python 环境 {#install}

采用[官方桥接示例仓库](https://github.com/78/mcp-calculator)的固定提交，便于复现本篇流程：

```sh
git clone https://github.com/78/mcp-calculator.git
cd mcp-calculator
git checkout c537f71d61fd73b47d6c8955b5df6d3721acf4e4
```

创建并激活环境。若系统的 Python 命令不同，请使用指向 Python 3.12 的命令：

::: code-group

```powershell [Windows PowerShell]
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

```sh [macOS / Linux]
python3.12 -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements.txt
```

:::

如 PowerShell 的脚本策略阻止激活，可直接用 `.\.venv\Scripts\python.exe` 代替后续 `python`，无需为此修改全局策略。依赖安装失败时先确认解释器和首条报错，不把仓库 README 中旧的最低 Python 版本当作当前所有依赖的兼容保证。

## 3. 创建最小工具 {#tool}

在 `mcp_pipe.py` 同一目录新建 **`safe_calculator.py`**，保存下面的完整代码：

```python
import logging
from mcp.server.fastmcp import FastMCP

logging.basicConfig(level=logging.INFO)  # 日志默认写到 stderr
mcp = FastMCP("XiaoZhiSafeCalculator")


@mcp.tool()
def add_numbers(a: int, b: int) -> dict:
    """需要精确相加两个整数时调用。每个输入范围为 -1000000 到 1000000。"""
    if not (-1_000_000 <= a <= 1_000_000 and -1_000_000 <= b <= 1_000_000):
        raise ValueError("每个输入必须在 -1000000 到 1000000 之间")
    return {"sum": a + b}


if __name__ == "__main__":
    mcp.run(transport="stdio")
```

这个工具只接收两个整数并相加，不执行模型传来的 Python 表达式。标准输出留给 MCP 协议，不用 `print()` 输出调试信息。

## 4. 设置端点并启动桥接 {#connect}

把占位说明替换为自己的端点，**不要把占位文字原样运行**：

::: code-group

```powershell [Windows PowerShell]
$env:MCP_ENDPOINT = '粘贴自己的完整端点地址'
python mcp_pipe.py safe_calculator.py
```

```sh [macOS / Linux]
export MCP_ENDPOINT='粘贴自己的完整端点地址'
python mcp_pipe.py safe_calculator.py
```

:::

保持终端运行。日志应先表明已连上 WebSocket，再启动 `safe_calculator.py`；工具发现时可看到列举工具的请求。只有“进程启动”还不足以确认智能体已发现工具。

结束时按 Ctrl+C。新终端需要重新激活环境和设置端点；给进程迁移到服务器时也要分别配置。

## 5. 验证发现和实际调用 {#verify}

1. 回到同一个智能体的 MCP 接入点，手动刷新连接状态/工具列表。
2. 确认列表中出现 **`add_numbers`**。没有出现时先按下表排查，不急着改对话提示词。
3. 对设备说：“请调用加法工具计算 37 加 58。”
4. 核对调用参数为 37、58，工具返回 `sum: 95`，设备最后回答与结果一致。可结合控制台对话记录与本地日志确认实际发生调用。

::: tip 完成标志
桥接进程持续在线，控制台发现 `add_numbers`，且一轮真实对话调用它并返回 95。模型直接算出 95 不等于已经验证工具接入。
:::

## 常见问题 {#troubleshooting}

| 现象 | 排查顺序 |
| --- | --- |
| `ModuleNotFoundError` | 确认当前 Python 来自 `.venv`，并在同一环境安装 requirements |
| 提示未设置 `MCP_ENDPOINT` | 在启动进程的同一个终端设置环境变量，不能只在另一个窗口设置 |
| WebSocket 连接/鉴权失败 | 检查复制是否完整、智能体是否正确、网络和地址有效性；分享日志先遮盖端点 |
| 已连接但没有工具 | 检查子进程错误、文件名与路径，是否向 stdout 输出了日志；刷新控制台工具列表 |
| 能看到工具但没调用 | 在同一智能体测试明确请求；查看工具描述、参数及对话调用记录 |
| 运行一会儿就离线 | 检查电脑睡眠、进程退出与网络变化；不要只看首次连接日志 |
| 输入超出范围 | 本示例主动拒绝超限，先用规定范围的整数验证 |

工具数量、报文和连接限制以当前服务要求为准，不把旧教程的固定 1024 字节描述作为所有场景通则。

## 下一步 {#next}

为新工具明确名称、参数类型、用途与错误结果。新增有副作用的工具时，先明确操作范围与身份验证；设备端 GPIO 工具请按[固件 MCP 文档](https://github.com/78/xiaozhi-esp32/blob/v2.6.0/docs/mcp-usage.md)开发。

桥接实现与依赖来源：[本篇固定的上游提交](https://github.com/78/mcp-calculator/tree/c537f71d61fd73b47d6c8955b5df6d3721acf4e4)。
