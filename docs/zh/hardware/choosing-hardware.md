---
id: "choosing-hardware"
title: "为小智选择硬件"
description: "按固件适配、接口、电压和资料完整性选型，不依赖旧价格与商品标题。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-10"]
---

# 为小智选择硬件

先选择已经有明确适配和接线说明的一套方案，再买模块。便宜、外形相近或芯片同名，都不能代替兼容性核对。

## 从用途开始 {#scope}

| 用途 | 建议核对 |
| --- | --- |
| 第一次做语音设备 | [基础 S3 面包板](./breadboard-esp32-s3)，器件和固件固定 |
| 更小的低成本设备 | [C3 + ES8311](./breadboard-esp32-c3)，不要混用 S3 音频模块 |
| 需要屏幕或拍照 | 选有匹配[彩屏](./displays/st7789)/[摄像头](./breadboard-camera)方案的硬件 |
| 定制成品 | 结合[设计要点](./design-guidelines)与独立板型维护 |

<figure class="source-figure">

[![原 S3 开发板外观示例。](/images/zh/doc-10-image-002.webp)](/images/zh/doc-10-image-002.webp)

<figcaption>原 S3 开发板外观示例。 来源：DOC-10 原图 2。</figcaption>
</figure>

<figure class="source-figure">

[![原麦克风模块示例。](/images/zh/doc-05-image-004.webp)](/images/zh/doc-05-image-004.webp)

<figcaption>原麦克风模块示例。 来源：DOC-10 原图 4。</figcaption>
</figure>

<figure class="source-figure">

[![原功放模块示例；型号和电气参数需要单独核对。](/images/zh/doc-05-image-007.webp)](/images/zh/doc-05-image-007.webp)

<figcaption>原功放模块示例；型号和电气参数需要单独核对。 来源：DOC-10 原图 5。</figcaption>
</figure>

## 买之前逐项核对 {#checklist}

- **主控与内存**：完整模组型号、Flash/PSRAM 容量及接口，是否有当前固件适配。
- **麦克风/Codec**：I2S、PDM 或模拟接口、信号方向、供电与声道选择。
- **功放**：输入格式、允许电压、负载阻抗、使能及默认增益电路。
- **显示**：驱动、分辨率、接口、地址、引脚、背光驱动与模块电压。
- **电源与线材**：USB 是否有数据、板上电源路径、峰值负载与可靠接触。

MAX98357A 与 B 不能笼统说“都通用”：数字输入格式不同。扬声器、耳机和有源音箱也不是同一输出负载，详见[音频输出](./audio-output)。

## 收货后先做什么 {#verify}

检查丝印、封装、排针和资料是否一致，再断电核对接线。优先完成基础设备的启动、显示、录放和对话，增加一个模块就单独测一次。

不要把卖家展示的彩屏图认作自己收到的屏幕规格，也不把“开发板带 5V 排针”推断成任意电池的充电口。

## 渠道与资料 {#sources}

原采购图用于识别器件，不保留时效价格、库存和对所有商家的质量断言。维护者更换渠道时也应维持同一套电气规格，不能只替换购物链接。支持情况见[板型与变体](./supported-boards)。

---

资料来源：[DOC-10 · 小智AI ESP32S3开发板+面包板DIY模块购买说明](https://my.feishu.cn/docx/HkxhdV5E9ovMIfxBOJbcXfVOnPg)。原图和原附件保留来源贡献者署名；文件的使用条件按各自原声明，未统一改为文档仓库许可。
