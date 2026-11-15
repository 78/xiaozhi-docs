---
id: "wake-on-lan"
title: "通过网络唤醒电脑的案例"
description: "明确 WoL 前提、第三方依赖和本地测试顺序，不把开机当成完整开关机。"
status: "review"
reviewedAt: "2026-11-15"
reviewNote: "第三方项目与样机尚未全部实测，使用前核对具体版本与硬件条件。"
sourceArticles: ["DOC-36"]
---

# 通过网络唤醒电脑的案例

本方案由**粽子同学**提供，用 ESP8266 在局域网发送 Wake-on-LAN 包，再通过第三方 MCP 平台触发。当前案例覆盖开机唤醒，不能由此推断已经实现远程关机。

<a name="scope"></a>

## 先确认前提 {#scope}

- PC 的网卡、主板和所处电源状态支持 WoL，并已按硬件/系统说明启用。
- PC 保持接电并按原方案连接有线网络。
- 唤醒模块持续通电、联网，与目标 PC 的网络路径可达；检查客户端隔离。
- 第三方平台、模块固件和 MCP 桥接均有明确版本和来源。

<figure class="source-figure">

[![先验证局域网唤醒，再接语音](../../../public/images/zh/wake-on-lan-flow.svg)](../../../public/images/zh/wake-on-lan-flow.svg)

<figcaption>先验证局域网唤醒，再接语音。点击查看大图。</figcaption>
</figure>

<a name="local"></a>

## 1. 先做本地测试 {#local}

先在局域网使用可验证的 WoL 工具确认目标 PC 能唤醒。记录有线网卡 MAC、目标网络和电源状态；本地都不能唤醒时，接入语音不会解决问题。

MAC/IP 是配置线索，不等于平台账号或模块 UUID。不要把它们填进不相干的字段。

<a name="module"></a>

## 2. 模块与平台 {#module}

下方保留 ESP8266 专用二进制与校验值；它不是 xiaozhi-esp32 固件，不能从小智主固件 Release 随意选择替代。源码需联系作者，不能称作完全自包含的官方开源方案。核对来源后按其文档烧录、配网，并确认模块在线。

原流程依赖 `xiaozhimcp.top` 等外部服务；使用前确认当前 HTTPS 入口、维护者和凭据用途。确认 HTTPS 入口后，使用自己的账号按平台说明配置端点。

<SourceMaterials article="DOC-36" />

### 填写模块与电脑参数

完整安装及该固件的烧录参数见[作者维护的图文指南](https://kcn80f4hacgs.feishu.cn/docx/RxRXd8aMDomjUXxlUcCcOE48ndh)和[安装演示视频](https://v.douyin.com/PvTrtOBS1n8/)。先确认其当前服务入口支持 HTTPS，再按以下对应关系配置：

| 字段 | 从哪里取得 | 不要误填 |
| --- | --- | --- |
| 唤醒模块 UUID | 模块配网热点名 `WLHX-XXXXXXXX` 的后缀，先记录再配网 | 不是 ESP32 启动 UUID 或电脑 MAC |
| 目标电脑 IPv4 | Windows“设置 → 网络和 Internet → 以太网”的当前网络属性 | 不用 Wi-Fi 网卡或手机的 IP |
| 目标电脑 MAC | 同一有线以太网连接的物理地址 | 不是唤醒模块的 MAC |
| 小智 MCP 接入点 | 目标智能体[扩展能力](../../mcp/quickstart.md#endpoint)中的完整端点 | 不填到电脑 IP 或模块 UUID 栏 |

Windows 也可在终端运行 `ipconfig /all`，在实际使用的以太网适配器下找 IPv4 地址和物理地址。检查两项属于同一张有线网卡。

按作者平台流程添加唤醒模块，填入电脑备注、IPv4 和 MAC，保存；开启相应智能硬件工具并启动对应智能体的 MCP 服务。先在平台按“开机”测试，再进入下方语音验证。平台要求的模块 UUID 与这台电脑的 MAC/IP 是两组信息，填错时先修正字段。

<a name="verify"></a>

## 3. 从平台到语音 {#verify}

1. 先用平台测试按钮发送唤醒，确认 PC 响应。
2. 再连接自己的智能体，确认相应开机工具被发现。
3. 用明确的设备名称触发，核对真实调用记录和 PC 的电源状态。
4. 测试模块断电、路由变化和 PC 不同睡眠/关机状态。

只看到“调用成功”不能证明 PC 已经启动；当前方案也不能由开机成功推断远程关机能力。

<a name="sources"></a>

## 下一步 {#sources}

先掌握[MCP 快速开始](../../mcp/quickstart.md)，再根据自己的网络选择维护方案。
