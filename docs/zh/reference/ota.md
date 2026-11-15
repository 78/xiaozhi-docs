---
id: "ota-reference"
title: "OTA 配置、激活与更新入口"
description: "以固件仓库的对应版本为准，区分启动配置、设备绑定和固件下载。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "适用固件 v2.6.0；完整规范和实现由固件仓库维护。"
sourceArticles: ["DOC-40"]
---

# OTA 配置、激活与更新入口

小智启动时通过 OTA 服务查询连接配置、激活信息和可用固件。这里的 OTA 不仅是“下载升级文件”；完整契约以 **xiaozhi-esp32 对应版本**为准。

<a name="scope"></a>

## 对照同一个版本 {#scope}

本页适用版本为 v2.6.0 / `4de00aed740595a8713b01f8332b9b2cf30685bc`。

| 主题 | 固件仓库的权威入口 |
| --- | --- |
| 地址、请求身份、能力、配置响应 | [OTA 中文文档](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/docs/ota_zh.md) |
| 激活 challenge、下载与版本判断 | [设备端 main/ota.cc](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/main/ota.cc) |
| 启动、绑定与更新流转 | [应用实现](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/main/application.cc) |

调试其他版本时同时切换文档和代码；服务实现应以它要兼容的客户端版本为契约，不要混用不同版本的路径和请求格式。

<a name="flows"></a>

## 区分四种操作 {#flows}

- **首次安装**：使用正确板型与完整镜像，见[烧录](../firmware/flashing.md)。
- **联网取配置**：设备请求自己的连接/能力配置，先检查实际 URL、身份和 HTTP 结果。
- **激活与绑定**：按响应及设备状态完成用户绑定；challenge、六位设备码和序列号各有用途，不互相替代。
- **版本更新**：核对固件版本、目标板型与布局，再下载匹配产物。

HTTP 请求布局版本、激活证明版本、传输封装版本、MCP 版本和 `application.version` 是不同概念。字段、头部和合法示例直接查同版本规范，本页不重复抄表。

<a name="debug"></a>

## 排查顺序 {#debug}

先确认设备联网和时间，再查看配置请求结果、激活状态、对话连接，最后看是否存在匹配更新。区分“服务不可达”“未绑定”“没有选定更新”“下载失败”。不要用一个固定升级 URL 代替所有设备的配置入口。

历史 `/api/ota/` 与设备可见 `/xiaozhi/ota/` 等路径可能来自不同部署层；使用自己的实际部署说明与当前客户端实现，先确认客户端真正请求的入口与部署层路由。

<a name="verify"></a>

## 怎么确认完成 {#verify}

在受控环境分别验证未绑定、已绑定、有/无更新和失败恢复，记录客户端版本与服务器配置。跨布局还需完整安装和数据保留测试；一次 HTTP 200 不能证明激活或升级链路全部成立。

<a name="next"></a>

## 下一步 {#next}

日常用户去[下载与选择](../firmware/downloads.md)和[配网绑定](../getting-started/wifi-and-binding.md)。服务端开发者在固件仓库维护契约和测试，按要兼容的客户端版本验证字段和分区行为。
