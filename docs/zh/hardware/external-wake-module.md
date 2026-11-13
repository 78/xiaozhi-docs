---
id: "external-wake-module"
title: "外接 ASR 唤醒模块"
description: "选择板载或外接唤醒方案，并按具体模块核对电源、触发和配置。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-32"]
---

# 外接 ASR 唤醒模块

外接语音模块负责识别离线指令，再用 GPIO 等信号通知小智。它适合某些资源不足或需要独立识别的方案，不是所有用户更换唤醒词的必需品。

## 先判断是否需要外接 {#scope}

先查[板载唤醒词](../development/wake-words)和自己的芯片、PSRAM、模型。如果现有硬件能满足需求，可以少一个模块、少一组电源和触发线。

<figure class="source-figure">

[![ASR CORE 模块外观。](/images/zh/doc-32-image-006.jpg)](/images/zh/doc-32-image-006.jpg)

<figcaption>ASR CORE 模块外观。 来源：DOC-32 原图 6。</figcaption>
</figure>

<figure class="source-figure">

[![原 ASR-LINK 下载器，用于辨认接口。](/images/zh/doc-32-image-007.jpg)](/images/zh/doc-32-image-007.jpg)

<figcaption>原 ASR-LINK 下载器，用于辨认接口。 来源：DOC-32 原图 7。</figcaption>
</figure>

<figure class="source-figure">

[![原模块配套麦克风。](/images/zh/doc-32-image-008.webp)](/images/zh/doc-32-image-008.webp)

<figcaption>原模块配套麦克风。 来源：DOC-32 原图 8。</figcaption>
</figure>

## 1. 区分模块与下载器 {#identify}

原教程包含 ASR PRO 核心板、带外围的开发板和 ASR-LINK 下载器。它们的供电、启动方式和引脚并不相同。记录完整型号与 PCB 修订，下载厂商对应的配置工具和引脚说明。

| 接口 | 必须确定的内容 |
| --- | --- |
| 电源输入 | 对应型号需要 5V 还是 3.3V，不能混用两种板子的表 |
| 信号输出 | 高/低有效、脉冲还是保持电平，主控能否承受其电压 |
| 下载串口 | RX/TX 方向、下载模式和逻辑电平 |
| 麦克风 | 已集成还是外接，极性与拾音位置 |

## 2. 在模块上配置命令 {#configure}

1. 按厂商说明建立离线词条，确认语言、触发动作和输出引脚。
2. 使用匹配的下载器编译并下载模块程序；厂商工具报错时先检查型号和接线，不把绕过系统保护作为默认步骤。
3. 先单独验证识别与输出脉冲，再连小智。能在 PC 工具中编译并不代表已经验证电气信号。

## 3. 接入小智 {#connect}

断电后按模块电源、公共 GND、逻辑输出和目标板接收引脚逐项连接。原文的 PA4/PA2、BOOT 等接法是特定方案示例，不是任意语音板都相同。

如需触发按钮输入，先确认按钮是否低有效、能否被外部驱动及启动绑带影响；原生下载模式和运行时对话不能混淆。改变固件时使用[独立板型](../development/custom-board)，在初始化代码中明确触发去抖和有效边沿。

## 怎么确认完成 {#verify}

先在模块端观察识别，再确认主控收到事件，最后验证一轮对话；额外测试误触发、连续触发、休眠与重新上电。不能只凭一次成功唤醒断言没有电平或启动风险。

## 素材与下一步 {#sources}

原模块照片保留作型号识别，过时工具界面和带时效的音乐链接不再作为操作步骤。源教程为 DOC-32。需要低资源硬件参考时查看[经典 ESP32](./breadboard-esp32)；具备相应资源时优先看[板载唤醒](../development/wake-words)。

---

资料来源：[DOC-32 · 小智AI终端ASR自定义唤醒词简单方案](https://kcn80f4hacgs.feishu.cn/docx/P2aqdFMO2ouXmZx9sNDcrAv1nJg)。原图和原附件保留来源贡献者署名；文件的使用条件按各自原声明，未统一改为文档仓库许可。
