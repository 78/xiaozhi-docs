---
id: "breadboard-esp32-c3"
title: "C3 面包板：ES8311 音频方案"
description: "明确 Codec 模块和引脚，不把 C3 音频方案与 S3 数字麦克风混用。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-12"]
---

# C3 面包板：ES8311 音频方案

原教程的 C3-N16-SF 搭配 ES8311/NS4150 音频模块，参考 Xmini-C3。它不是任意 C3 加 INMP441/MAX98357A 的通用接线。

<figure class="source-figure">

[![原 C3 主控模块。](/images/zh/doc-12-image-001.webp)](/images/zh/doc-12-image-001.webp)

<figcaption>原 C3 主控模块。 来源：DOC-12 原图 1。</figcaption>
</figure>

<figure class="source-figure">

[![原 ES8311 与 NS4150 音频模块；核对具体版本和丝印。](/images/zh/doc-12-image-002.webp)](/images/zh/doc-12-image-002.webp)

<figcaption>原 ES8311 与 NS4150 音频模块；核对具体版本和丝印。 来源：DOC-12 原图 2。</figcaption>
</figure>

<figure class="source-figure">

[![原 OLED 模块。](/images/zh/doc-12-image-009.webp)](/images/zh/doc-12-image-009.webp)

<figcaption>原 OLED 模块。 来源：DOC-12 原图 9。</figcaption>
</figure>

## 准备工作 {#scope}

确认目标芯片、Flash 容量、Codec 模块原理图、PA 使能和显示屏。ES8311 模块的模拟麦克风/功放外围必须完整；模块标的 DI/DO 要核对相对于谁的方向。

## 1. 对照固件引脚 {#wiring}

v2.6.0 的 `xmini/c3` 使用下列配置；新硬件必须确认与其真正相同，否则建立[独立板型](../development/custom-board)。

| 功能 | GPIO |
| --- | --- |
| ES8311 I2C SDA / SCL | 3 / 4 |
| I2S MCLK / BCLK / WS | 10 / 8 / 6 |
| Codec ADC 数据进入主控 DIN | 7 |
| 主控 DOUT 输出到 Codec DAC | 5 |
| PA 使能 | 11 |
| BOOT | 9 |

显示屏与 Codec 可能共用 I2C，总线、电压和设备地址要分别确认。用短线和可靠公共 GND；不因 GPIO 名称相同就忽略模块供电条件。

<figure class="source-figure">

[![原 C3 面包板装配照片；不按线色推断 GPIO。](/images/zh/doc-12-image-012.jpg)](/images/zh/doc-12-image-012.jpg)

<figcaption>原 C3 面包板装配照片；不按线色推断 GPIO。 来源：DOC-12 原图 12。</figcaption>
</figure>

## 2. 安装并使用 {#build}

1. 如果完全复现已有硬件，选择对应 `xmini/c3` 构建；V3 与 4G 不是同一配置。
2. 在[在线编译](../firmware/online-builder)或[官方发布](../firmware/downloads)取得匹配版本，按[烧录流程](../firmware/flashing)安装。
3. 先验证提示音、显示和按键，再[联网绑定](../getting-started/wifi-and-binding)。
4. 测试录音/播放后，再启用该芯片兼容的唤醒模型。

C3 当前存在轻量 WakeNet 路径，且项目有 C3 4G 板型；旧文的“一律不支持”不能沿用。无 PSRAM 和不同资源条件仍影响模型，见[唤醒词](../development/wake-words)。

## 怎么确认完成 {#verify}

指定的 Codec 和 PA 能录放，显示正常、按键发起一轮对话成功；没有 I2C 失败、持续爆音或复位。出现 I2C 问题先检查 SDA/SCL、上拉、电源与地址，不直接判定固件损坏。

## 历史附件与下一步 {#materials}

旧调试 `.bin` 不作为当前默认安装包，历史用途和来源仍记录在素材清单。板级配置以[固件 xmini/c3](https://github.com/78/xiaozhi-esp32/tree/4de00aed740595a8713b01f8332b9b2cf30685bc/main/boards/xmini/c3)为准；成品板阅读[Xmini 系列](./boards/xmini-c3)。



---

资料来源：[DOC-12 · ESP32-C3小智AI终端面包板DIY硬件接线教程](https://my.feishu.cn/docx/OnVIdPkTHoktJVxJ16ccanFfn8d)。原图和原附件保留来源贡献者署名；文件的使用条件按各自原声明，未统一改为文档仓库许可。
