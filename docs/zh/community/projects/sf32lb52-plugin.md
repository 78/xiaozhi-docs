---
id: "sf32lb52-plugin"
title: "SF32LB52：教程与固件入口"
description: "前往嘉立创维护的插件版教程，选择匹配硬件的 SF32 固件。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已核对嘉立创教程目录、固件与资料下载页面；本站只维护入口，不复制设计和操作规范。"
sourceArticles: ["DOC-30"]
prev: false
next: false
---

# SF32LB52：教程与固件入口

SF32LB52 小智使用独立的 SF32 固件。插件版的电路、PCB、焊接、外壳与面板制作，请直接阅读嘉立创维护的完整教程。

<a name="scope"></a>

## 教程与设计资料 {#scope}

<span id="materials"></span>
<span id="circuit"></span>
<span id="enclosure"></span>

| 你要做什么 | 维护入口 |
| --- | --- |
| 从零制作插件版 | [嘉立创插件版小智完整教程](https://openkits-wiki.easyeda.com/zh-hans/hspi-sf32lb52/training/xiaozhi-ai/) |
| 查电路、PCB、焊接和外壳 | 在完整教程中选择对应章节，按自己的硬件修订核对 |
| 获取原理图、PCB 与外壳文件 | [嘉立创资料下载](https://openkits-wiki.easyeda.com/zh-hans/hspi-sf32lb52/training/xiaozhi-ai/download.html) |

<a name="flash"></a>

## 固件与使用 {#flash}

<span id="network"></span>
<span id="verify"></span>

- [插件版固件下载与烧录教程](https://openkits-wiki.easyeda.com/zh-hans/hspi-sf32lb52/training/xiaozhi-ai/firmware-download.html)：按该硬件的工具、文件和地址操作。
- [xiaozhi-sf32 源码与使用入口](https://github.com/78/xiaozhi-sf32)：查看支持硬件与该版本的使用说明。
- [SF32 固件发布](https://github.com/78/xiaozhi-sf32/releases)：选择与板卡匹配的构建。

SF32 与 ESP32 的芯片、下载工具和固件格式不同。不要将 ESP32 的在线编译产物或完整镜像写入本设备；联网方式按 SF32 教程及手机支持情况确认。

<a name="hardware"></a>

## 认识这套硬件 {#hardware}

<figure class="source-figure">

[![插件版原型与外观。](../../../public/images/zh/doc-30-image-001.webp)](../../../public/images/zh/doc-30-image-001.webp)

<figcaption>插件版原型与外观。</figcaption>
</figure>

<a name="sources"></a>

## 下一步 {#sources}

需要自己接 ESP32 面包板时，继续[基础 S3 教程](../../hardware/breadboard-esp32-s3.md)。其他社区硬件见[开源硬件目录](../open-hardware.md)。
