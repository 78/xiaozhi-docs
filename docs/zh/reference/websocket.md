---
id: "websocket-reference"
title: "WebSocket 协议入口与版本"
description: "从固件仓库查阅对应版本的传输、会话和音频协议。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "完全以本地 xiaozhi-esp32 对应提交的文档与实现为准；飞书旧协议不作为规范，本文只提供版本化入口。"
sourceArticles: ["DOC-38"]
---

# WebSocket 协议入口与版本

WebSocket 的完整消息格式、二进制封装和状态流转由 **xiaozhi-esp32 仓库**维护。飞书旧说明不再作为协议依据，本页只帮助定位同一版本的文档与实现。

## 选择基线 {#scope}

本轮对应固件 **v2.6.0**，本地提交 `4de00aed740595a8713b01f8332b9b2cf30685bc`。调试其他版本时，切换到那个版本的仓库文档，不混用后来的字段。

| 需要查什么 | 权威位置 |
| --- | --- |
| 总流程、请求头、JSON、音频与状态 | [同版本 WebSocket 文档](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/docs/websocket.md) |
| 握手、版本头、二进制收发、服务器 hello 解析 | [websocket_protocol.cc](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/main/protocols/websocket_protocol.cc) |
| 地址与令牌从哪里来 | [OTA 配置与激活](./ota) |
| MCP 怎样承载在连接中 | [同版本 MCP 协议](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/docs/mcp-protocol.md) |

## 核对顺序 {#debug}

1. 从日志确定固件、板型及实际连接方式，先核对 OTA 下发的连接配置。
2. 对照请求头与 hello，确认双方选择的封装版本、音频参数和能力。
3. 区分 JSON 控制消息、二进制音频与工具调用，不能把不同协议层的版本号混作一个版本。
4. 检查会话信息、状态与错误，再用真实的收发序列定位问题。

当前实现解析服务器 `session_id`，也支持多种二进制封装。不能沿用飞书的“没有会话 ID”或只描述裸 Opus 的说法。

## 如何维护 {#verify}

协议差异、字段和解析示例先在固件仓库修正，文档站再更新固定版本入口。图示也跟随固件版本维护；飞书旧 Manual/Auto 图不复制为当前状态机。

完成互通验证要有双方版本与实际报文证据，不能只确认 WebSocket 建连成功。分享报文前去除鉴权和设备标识。

## 下一步 {#next}

显示情绪语义见[表情与资源](./display-emotions)。准备自建服务时从上述同版本文档和测试入口开始，不维护一份独立于固件的协议副本。

---

资料来源：[DOC-38 · 通信协议：Websocket 连接](https://my.feishu.cn/docx/RD0Sdhjmjop0axxlsDrcOxAsnfd)。原图和原附件保留来源贡献者署名；文件的使用条件按各自原声明，未统一改为文档仓库许可。
