---
id: "supported-boards"
title: "查找支持的开发板与变体"
description: "从固件目录和构建选项确认支持范围，而不是按在售状态判断兼容性。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-31"]
---

# 查找支持的开发板与变体

“这块板在出售”“芯片是 S3”和“所选固件支持它”是不同信息。以固件仓库和当前构建目录核对实际支持范围。

## 先识别硬件 {#scope}

准备板卡正反面丝印、主控/Flash/PSRAM、屏幕和音频芯片型号，以及 Wi-Fi/4G 等通信方式。同一系列不同修订版可能使用另一组引脚。

<figure class="source-figure">

[![Xmini-C3 系列成品外观；外壳相似不能代替 PCB 修订和固件变体核对。](/images/zh/doc-31-image-003.webp)](/images/zh/doc-31-image-003.webp)

<figcaption>Xmini-C3 系列成品外观；外壳相似不能代替 PCB 修订和固件变体核对。</figcaption>
</figure>

<figure class="source-figure">

[![ESP32-BOX-3 外观。](/images/zh/doc-31-image-004.webp)](/images/zh/doc-31-image-004.webp)

<figcaption>ESP32-BOX-3 外观。</figcaption>
</figure>

<figure class="source-figure">

[![M5Stack CoreS3 外观；支持范围以固件目录为准。](/images/zh/doc-31-image-012.webp)](/images/zh/doc-31-image-012.webp)

<figcaption>M5Stack CoreS3 外观；支持范围以固件目录为准。</figcaption>
</figure>

## 1. 在现行目录中查找 {#lookup}

- 不安装 SDK：打开[在线编译](../firmware/online-builder)，按目标芯片、开发板和变体查找。
- 使用源码：在[对应版本环境](../development/build-firmware)执行：

```sh
python scripts/build.py --list-boards
python scripts/build.py --list-boards --json
```

列表的目录名、板型类型、构建名称各有用途；发布包有时还包含制造商前缀。匹配完整身份，不只比较文件名里是否含“C3”或“S3”。

## 2. 找到适合的指南 {#guides}

| 硬件 | 本站入口 |
| --- | --- |
| S3 + I2S 麦克风 + OLED | [基础面包板](./breadboard-esp32-s3) |
| S3 + SPI LCD | [彩屏扩展](./displays/st7789) |
| 带摄像头的 S3 方案 | [摄像头面包板](./breadboard-camera) |
| C3 + ES8311 | [C3 面包板](./breadboard-esp32-c3)或[Xmini 系列](./boards/xmini-c3) |
| 经典 ESP32 | [经典 ESP32 面包板](./breadboard-esp32) |
| SF32LB52 | [独立 SF32 插件版项目](../community/projects/sf32lb52-plugin)，不使用 ESP32 固件 |

没有本站专页的板仍可能被固件支持，先看[版本化 boards 目录](https://github.com/78/xiaozhi-esp32/tree/4de00aed740595a8713b01f8332b9b2cf30685bc/main/boards)和板内 README。

## 3. 选择固件 {#firmware}

找到准确变体后，优先使用[在线编译并烧录](../firmware/online-builder)；需要离线安装或固定版本时再从[官方发布](../firmware/downloads)获取固件。若自己改过引脚，应建立[独立板型](../development/custom-board)，而不是接受标准板的 OTA 身份。

停售、缺货或商家链接失效不等于已经取消固件支持。采购渠道单独维护，价格与库存以商家当前页面为准。

::: tip 完成标志
实物、构建目录、变体、内存和外设可以一一对应；没有靠“名字最接近”选择固件。
:::

## 下一步 {#sources}

通过照片识别外观后，仍要核对产品修订和具体构建变体。准备采购时继续[硬件选型](./choosing-hardware)，找到固件后继续[烧录](../firmware/flashing)。
