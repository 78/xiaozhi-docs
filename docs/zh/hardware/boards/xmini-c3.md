---
id: "xmini-c3"
title: "Xmini-C3、V3 与 4G 版本"
description: "先辨认板型修订，再选择固件、供电和操作流程。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-29"]
---

# Xmini-C3、V3 与 4G 版本

Xmini 是一组硬件，不能把 Wi-Fi、V3 与 4G 版当成同一块板。电路、音频引脚和网络初始化由对应固件决定。

<figure class="source-figure">

[![Xmini-C3 板外观。](/images/zh/doc-29-image-001.webp)](/images/zh/doc-29-image-001.webp)

<figcaption>Xmini-C3 板外观。</figcaption>
</figure>

## 1. 对照自己的板 {#scope}

| 系列 | v2.6.0 源码目录 | 核对重点 |
| --- | --- | --- |
| C3 Wi-Fi | `xmini/c3` | ES8311、OLED 和原版引脚 |
| C3 V3 | `xmini/c3-v3` | 与原版不同的 I2S/I2C/PA 引脚 |
| C3 4G | `xmini/c3-4g` | 蜂窝模块、SIM、供电与网络配置 |

例如原版 Codec 的 I2C 在 GPIO3/4，V3 在 GPIO0/1；不要从旧照片推断新板的连接。具体以[当前板型目录](https://github.com/78/xiaozhi-esp32/tree/4de00aed740595a8713b01f8332b9b2cf30685bc/main/boards/xmini)为准。

<figure class="source-figure">

[![原板 BOOT、开关与 USB 位置；不要据此推断 V3 的引脚。](/images/zh/doc-29-image-019.webp)](/images/zh/doc-29-image-019.webp)

<figcaption>原板 BOOT、开关与 USB 位置；不要据此推断 V3 的引脚。</figcaption>
</figure>

## 2. 安装固件 {#flash}

在[在线编译](../../firmware/online-builder)或[官方发布](../../firmware/downloads)找到准确板型和变体。发布包可能带制造商前缀，按目录与完整名称一起核对。v1 旧设备需要历史固件时，只使用与硬件匹配的 [v1.9.4](../../firmware/releases/v1.9.4)。

按[烧录指南](../../firmware/flashing)进入该板的下载模式。C3 的 BOOT 及 USB 行为与基础 S3 不同，使用板卡说明和当前源码，而不是照搬 S3 的 GPIO0 接法。

## 3. 联网、绑定与对话 {#use}

Wi-Fi 版按固件选择热点或 BluFi 配网，继续[设备绑定](../../getting-started/wifi-and-binding)。4G 版先确认模块、SIM 和网络状态，再取得六位设备码。

先用按键验证拾音和播放，再测唤醒。当前 C3 构建可使用匹配的轻量 WakeNet 模型，不能沿用“C3 一律无离线唤醒”的旧结论；可用词以[唤醒指南](../../development/wake-words)和实际模型为准。

电池电压检测、充电口、休眠与按键行为按具体硬件修订确认，不因为界面出现电量图标就推断所有版本能检测电池。

## 怎么确认完成 {#verify}

版本和变体符合实物，显示、音频、网络与对话通过；电池/唤醒功能仅在对应硬件和构建确实支持时验证。把结果记录到具体版本，避免用一块板的成功覆盖整系列。

## 下一步 {#sources}

照片用于辨认对应修订的按键与接口；具体引脚和行为以板卡说明及匹配固件为准。开源设计由[虾哥的 Xmini 项目](https://oshwhub.com/tenclass01/xmini_c3)维护。自己接 C3 面包板时看[C3 + ES8311](../breadboard-esp32-c3)。
