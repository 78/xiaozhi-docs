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

## 1. 区分模块与下载器 {#identify}

<figure class="source-figure">

[![ASR CORE 模块外观。](/images/zh/doc-32-image-006.jpg)](/images/zh/doc-32-image-006.jpg)

<figcaption>ASR CORE 模块外观。</figcaption>
</figure>
<figure class="source-figure">

[![ASR-LINK 下载器，用于辨认接口。](/images/zh/doc-32-image-007.jpg)](/images/zh/doc-32-image-007.jpg)

<figcaption>ASR-LINK 下载器，用于辨认接口。</figcaption>
</figure>
<figure class="source-figure">

[![模块配套麦克风。](/images/zh/doc-32-image-008.webp)](/images/zh/doc-32-image-008.webp)

<figcaption>模块配套麦克风。</figcaption>
</figure>

ASR PRO 核心板、带外围的开发板和 ASR-LINK 下载器是不同硬件。它们的供电、启动方式和引脚并不相同。记录完整型号与 PCB 修订，下载厂商对应的配置工具和引脚说明。

| 接口 | 必须确定的内容 |
| --- | --- |
| 电源输入 | 对应型号需要 5V 还是 3.3V，不能混用两种板子的表 |
| 信号输出 | 高/低有效、脉冲还是保持电平，主控能否承受其电压 |
| 下载串口 | RX/TX 方向、下载模式和逻辑电平 |
| 麦克风 | 已集成还是外接，极性与拾音位置 |

<figure class="source-figure">

[![ASR PRO V2.0 开发板示例：带 USB 和外围电路，不等同于仅有焊盘的核心板。](/images/zh/doc-32-image-051.webp)](/images/zh/doc-32-image-051.webp)

<figcaption>ASR PRO V2.0 开发板示例：带 USB 和外围电路，不等同于仅有焊盘的核心板。</figcaption>
</figure>

<figure class="source-figure">

[![ASR PRO 4M 核心板示例：存储容量、下载方式和引脚按对应修订核对。](/images/zh/doc-32-image-052.webp)](/images/zh/doc-32-image-052.webp)

<figcaption>ASR PRO 4M 核心板示例：存储容量、下载方式和引脚按对应修订核对。</figcaption>
</figure>

## 2. 在模块上配置命令 {#configure}

1. 从[天问官方页面](https://www.twen51.com/new/art_show.php?id=230)取得支持 ASRPRO 的天问 Block，按[官方使用说明](https://www.twen51.com/new/learning_show.php?id=559)选择匹配的主板。
2. 建立离线识别词条，设置唤醒词、识别命令及动作；明确使用哪个 GPIO、有效电平和脉冲持续时间。不要把核心板 PA4 与开发板 PA2 的例子混成一个程序。
3. 使用匹配的下载器编译并下载模块程序；厂商工具报错时先检查型号和接线，不把绕过系统保护作为默认步骤。
4. 先单独验证识别与输出脉冲，再连小智。能在 PC 工具中编译并不代表已经验证电气信号。

<figure class="source-figure">

[![天问 Block 的词条与 GPIO 动作积木示例。配置重点是识别后输出的引脚、极性和持续时间，参数须与实际板级输入匹配。](/images/zh/doc-32-image-023.webp)](/images/zh/doc-32-image-023.webp)

<figcaption>天问 Block 的词条与 GPIO 动作积木示例。配置重点是识别后输出的引脚、极性和持续时间，参数须与实际板级输入匹配。</figcaption>
</figure>

<figure class="source-figure">

[![ASRPRO 下载工具示例：选择下载器串口、芯片型号与本次生成的程序文件，不能使用小智主固件包替代。](/images/zh/doc-32-image-029.webp)](/images/zh/doc-32-image-029.webp)

<figcaption>ASRPRO 下载工具示例：选择下载器串口、芯片型号与本次生成的程序文件，不能使用小智主固件包替代。</figcaption>
</figure>

## 3. 接入小智 {#connect}

断电后按模块电源、公共 GND、逻辑输出和目标板接收引脚逐项连接。PA4/PA2、BOOT 等接口的用途由具体模块和固件定义，不是所有语音板都相同。

如需触发按钮输入，先确认按钮是否低有效、能否被外部驱动及启动绑带影响；原生下载模式和运行时对话不能混淆。改变固件时使用[独立板型](../development/custom-board)，在初始化代码中明确触发去抖和有效边沿。

### 面包板安装示例 {#prototype}

下面的样机把 ASR 核心板安装在基础面包板旁边；绿色标线表示识别输出接入主控按钮输入的思路。**这张图不能直接充当所有 ASR 模块的接线表**：模块的 5V 供电不代表输出逻辑是 5V；接 ESP32 前测量输出电平并核对两端规格，必要时使用匹配的电平转换。BOOT/GPIO0 还会影响启动模式。

<figure class="source-figure">

[![核心板在面包板上的安装位置；先确认排针方向和相邻触点，避免跨接电源。](/images/zh/doc-32-image-033.webp)](/images/zh/doc-32-image-033.webp)

<figcaption>核心板在面包板上的安装位置；先确认排针方向和相邻触点，避免跨接电源。</figcaption>
</figure>

<figure class="source-figure">

[![样机的 ASR 输出到 S3 按钮输入示意。只用于理解信号关系；供电、电平、极性与启动行为须按具体模块确认。](/images/zh/doc-32-image-034.webp)](/images/zh/doc-32-image-034.webp)

<figcaption>样机的 ASR 输出到 S3 按钮输入示意。只用于理解信号关系；供电、电平、极性与启动行为须按具体模块确认。</figcaption>
</figure>

## 怎么确认完成 {#verify}

先在模块端观察识别，再确认主控收到事件，最后验证一轮对话；额外测试误触发、连续触发、休眠与重新上电。不能只凭一次成功唤醒断言没有电平或启动风险。

## 下一步 {#sources}

先按模块型号选择厂商对应的工具和配置。需要低资源硬件参考时查看[经典 ESP32](./breadboard-esp32)；具备相应资源时优先看[板载唤醒](../development/wake-words)。
