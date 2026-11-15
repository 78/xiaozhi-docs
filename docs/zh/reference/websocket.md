---
id: "websocket-reference"
title: "WebSocket 协议入口与版本"
description: "从固件仓库查阅对应版本的传输、会话和音频协议。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "适用固件 v2.6.0；完整规范和实现由固件仓库维护。"
sourceArticles: ["DOC-38"]
---

# WebSocket 协议入口与版本

WebSocket 的完整消息格式、二进制封装和状态流转由 **xiaozhi-esp32 仓库**维护。本页提供同一版本的文档与实现入口。

<a name="scope"></a>

## 选择基线 {#scope}

本页适用固件 **v2.6.0**，对应提交 `4de00aed740595a8713b01f8332b9b2cf30685bc`。调试其他版本时，切换到那个版本的仓库文档，不混用后来的字段。

| 需要查什么 | 权威位置 |
| --- | --- |
| 总流程、请求头、JSON、音频与状态 | [同版本 WebSocket 文档](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/docs/websocket.md) |
| 握手、版本头、二进制收发、服务器 hello 解析 | [websocket_protocol.cc](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/main/protocols/websocket_protocol.cc) |
| 地址与令牌从哪里来 | [OTA 配置与激活](./ota.md) |
| MCP 怎样承载在连接中 | [同版本 MCP 协议](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/docs/mcp-protocol.md) |

<a name="debug"></a>

## 核对顺序 {#debug}

1. 从日志确定固件、板型及实际连接方式，先核对 OTA 下发的连接配置。
2. 对照请求头与 hello，确认双方选择的封装版本、音频参数和能力。
3. 区分 JSON 控制消息、二进制音频与工具调用，不能把不同协议层的版本号混作一个版本。
4. 检查会话信息、状态与错误，再用真实的收发序列定位问题。

当前实现解析服务器 `session_id`，也支持多种二进制封装。调试时同时核对会话和所用二进制封装版本。

<a name="verify"></a>

## 如何维护 {#verify}

协议差异、字段和解析示例先在固件仓库修正，文档站再更新固定版本入口。状态图也应与正在调试的固件版本一致。

完成互通验证要有双方版本与实际报文证据，不能只确认 WebSocket 建连成功。分享报文前去除鉴权和设备标识。

<a name="next"></a>

## 下一步 {#next}

显示情绪语义见[表情与资源](./display-emotions.md)。准备自建服务时从上述同版本文档和测试入口开始，不维护一份独立于固件的协议副本。
