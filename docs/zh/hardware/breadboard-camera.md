---
id: "breadboard-camera"
title: "摄像头 S3 面包板"
description: "为摄像头、彩屏和音频选择相互匹配的引脚与固件。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-07"]
---

# 摄像头 S3 面包板

本页对应 `bread-compact-wifi-s3cam`，是摄像头、SPI 屏幕和音频共存的板型。普通 S3 + OLED/LCD 接线不能直接增加摄像头就变成此方案。

<figure class="source-figure">

[![原摄像头模块与排线接口。](/images/zh/doc-07-image-001.webp)](/images/zh/doc-07-image-001.webp)

<figcaption>原摄像头模块与排线接口。 来源：DOC-07 原图 1。</figcaption>
</figure>

<figure class="source-figure">

[![原 LCD 模块外观。](/images/zh/doc-06-image-001.webp)](/images/zh/doc-06-image-001.webp)

<figcaption>原 LCD 模块外观。 来源：DOC-07 原图 2。</figcaption>
</figure>

<figure class="source-figure">

[![原 LCD 模块接口丝印。](/images/zh/doc-06-image-002.webp)](/images/zh/doc-06-image-002.webp)

<figcaption>原 LCD 模块接口丝印。 来源：DOC-07 原图 3。</figcaption>
</figure>

## 准备工作 {#scope}

核对 S3 模组内存、摄像头传感器/引脚、屏幕驱动/分辨率、麦克风和功放。原教程以特定 N16R8 CAM 板和 OV3660 演示；OV2640/OV5640 等型号需要各自确认驱动、线序与实际取图，不能仅凭接口相同认定兼容。

## 1. 对照当前信号表 {#wiring}

以下来自[本地固件对应版本的板型配置](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/main/boards/bread-compact-wifi-s3cam/config.h)，用于核对完整方案。电源、排线方向和外设使能还需按实物模块说明。

| 模块 | 信号 → GPIO |
| --- | --- |
| 麦克风 | WS→1、SCK→2、数据输入→42 |
| 功放 | DIN→39、BCLK→40、LRC→41 |
| LCD | CLK→19、MOSI→20、DC→47、RST→21、CS→45、背光→38 |
| 摄像头 D0–D7 | 11、9、8、10、12、18、17、16 |
| 摄像头控制 | XCLK→15、PCLK→13、VSYNC→6、HREF→7、SIOC→5、SIOD→4 |

注意 LCD 这里占用 GPIO19/20；对使用原生 USB 的连接方式尤其要按板级电路确认，不能随意重接数据线。断电核对所有占用，不同时套用普通面包板的 GPIO4/5/6 音频接法。

<figure class="source-figure">

[![原摄像头面包板装配示例。](/images/zh/doc-07-image-004.webp)](/images/zh/doc-07-image-004.webp)

<figcaption>原摄像头面包板装配示例。 来源：DOC-07 原图 4。</figcaption>
</figure>

<figure class="source-figure">

[![原型装配的另一视角；信号接法请以本页版本表为准。](/images/zh/doc-07-image-005.webp)](/images/zh/doc-07-image-005.webp)

<figcaption>原型装配的另一视角；信号接法请以本页版本表为准。 来源：DOC-07 原图 5。</figcaption>
</figure>

## 2. 构建并逐项检查 {#build}

1. 在[在线编译](../firmware/online-builder)选择准确的摄像头板型、变体及显示参数。当前该目录的默认是 ST7789 240×320。
2. 按摄像头安装方向选择镜像/翻转；没有相应选项时不要通过选另一个板型强行开启。
3. 按[烧录指南](../firmware/flashing)安装，先验证屏幕和音频。
4. 完成[联网与绑定](../getting-started/wifi-and-binding)，确认普通对话正常。
5. 再用当前服务支持的识图功能验证图像方向、曝光、清晰度和实际调用结果。

工具显示编译成功不等于摄像头已被驱动。`camera init` 失败时先看日志、传感器和供电；图像全黑时核对排线与镜头，不反复换未知二进制。

## 视频和历史附件 {#materials}

原文的接线视频保留用于观察特定样机，不能证明所有传感器都兼容。旧 `.bin` 改链接到原版本/上游入口，当前安装仍从[固件选择](../firmware/downloads)开始。

<SourceMaterials article="DOC-07" />

## 怎么确认完成 {#verify}

图像方向和内容正确，音频、显示、Wi-Fi 及识图能一起工作；连续测试没有供电复位或引脚冲突。反馈要附摄像头型号、板号、源码版本和经过遮盖的日志。

---

资料来源：[DOC-07 · 【最新】小智AI面包板带摄像头互动功能接线教程](https://my.feishu.cn/docx/XmewdwEQroT3buxKN9GcpEm5nng)。原图和原附件保留来源贡献者署名；文件的使用条件按各自原声明，未统一改为文档仓库许可。
