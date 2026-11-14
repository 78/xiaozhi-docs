---
id: "sf32lb52-plugin"
title: "SF32LB52 插件版：电路、外壳与蓝牙联网"
description: "保留插件版的设计资料和制作路径，按独立平台组织复现。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "第三方项目与样机尚未全部实测，使用前核对具体版本与硬件条件。"
sourceArticles: ["DOC-30"]
---

# SF32LB52 插件版：电路、外壳与蓝牙联网

这是一套使用 **SF32LB52** 的插件式小智设备，包含电路、PCB、3D 外壳、面板、焊接和联网资料。它是独立平台，使用 [xiaozhi-sf32](https://github.com/78/xiaozhi-sf32)，不是 ESP32 开发板的替代烧录参数。

<figure class="source-figure">

[![插件版原型与外观。](/images/zh/doc-30-image-001.webp)](/images/zh/doc-30-image-001.webp)

<figcaption>插件版原型与外观。</figcaption>
</figure>

<figure class="source-figure">

[![设计尺寸示意；生产尺寸以工程文件为准。](/images/zh/doc-30-image-006.webp)](/images/zh/doc-30-image-006.webp)

<figcaption>设计尺寸示意；生产尺寸以工程文件为准。</figcaption>
</figure>

<SourceMaterials article="DOC-30" only="DOC-30-file-008" />

## 开始前先核对硬件修订 {#scope}

本页工程文件为 V1.3，复刻前需要处理 **PA34 与电池 VSYS 的电平问题**。复刻前先核对实际 PCB、按键/唤醒电路、主控允许电平及电池型号；先完成电平复核，再进行装配。

本文保留原理和工程资料，电平修订仍需工程复核。外形相同的 CR123A 电池也可能是不可充电或不同化学体系，不能只按外形购买；按电路规定的工作电压与充电设计匹配。

## 1. 准备项目资料 {#materials}

下面的文件按原作者文件名、版本与校验值整理。原理图、PCB 外形、STL、面板工程各有用途，不能只下载固件就开始焊接。

<SourceMaterials article="DOC-30" kind="file" />

### 原 V1.3 物料表 {#bom}

手机上可左右滑动物料表，查看完整型号与器件编号。

下面保留设计的器件参数与商城编号，便于核对封装，不代表当前库存、价格或 PA34 修订后的最终 BOM。原表屏幕分辨率与实际采购规格仍需核对；孔位、屏幕排母、DIP-8 芯片座、扬声器、电池和外壳也要列入自己的装配清单。

| 序号 | 器件类型 | 器件参数 | 数量 | 器件编号 |
|-|-|-|-|-|
| 1 | 电阻 | 10kΩ | 9 | C2903232 |
| 2 | 电容 | 10nF | 1 | C2832505 |
| 3 | 电容 | 100nF | 2 | C254085 |
| 4 | 电容 | 1uF | 2 | C62934 |
| 5 | 电容 | 22uF | 1 | C43346 |
| 6 | 主控 | LC-OPEN-SF32LB52-MOD-N16R8 | 1 | C42924267 |
| 7 | 弯插排母 | 2x5P 2.54mm 排母 | 1 | C2897425 |
| 8 | 麦克风 | 6x5mm-36db MIC麦克风 | 1 | C233939 |
| 9 | 喇叭接口 | 2P 3.81mm | 1 | C2826458 |
| 10 | 滑动开关 | SK12D07VG5 | 1 | C431548 |
| 11 | 按键 | ZX-QC66-8.5CJ | 2 | C7470133 |
| 12 | LED灯 | 5mm圆形灯头 绿色 | 1 | C2895548 |
| 13 | 音频功放芯片 | LM4871N | 1 | C47089163 |
| 14 | 电池盒 | BH-123A-A1CJ002 | 1 | C5290177 |
| 15 | 1.69寸TFT屏幕 | 1.69寸300 \* 240 TFT LCD | 1 | 使用用户贡献的器件封装，见下方说明 |
| 16 | M3定位孔 | M3定位孔 | 1 | 常用库中使用M3螺丝，见下方说明 |

设计另列 DIP-8 芯片座 `C72124`，先焊接座子再安装 LM4871N。提供的装配位号存在重复/不一致，不能直接作为生产装配表；先在工程中重新标注，导出一致的 BOM 与位号图。

## 2. 理解电路与制作顺序 {#circuit}

先核对电源、主控、音频功放、麦克风、显示、按钮和串口下载，再安排装配。

<figure class="source-figure">

[![原 V1.3 电路图，保留用于理解设计；PA34 修订需另行复核。](/images/zh/doc-30-image-012.webp)](/images/zh/doc-30-image-012.webp)

<figcaption>原 V1.3 电路图，保留用于理解设计；PA34 修订需另行复核。</figcaption>
</figure>

<figure class="source-figure">

[![原音频功放电路。](/images/zh/doc-30-image-017.webp)](/images/zh/doc-30-image-017.webp)

<figcaption>原音频功放电路。</figcaption>
</figure>

<figure class="source-figure">

[![原麦克风电路。](/images/zh/doc-30-image-020.webp)](/images/zh/doc-30-image-020.webp)

<figcaption>原麦克风电路。</figcaption>
</figure>

<figure class="source-figure">

[![原串口连接示意。](/images/zh/doc-30-image-025.webp)](/images/zh/doc-30-image-025.webp)

<figcaption>原串口连接示意。</figcaption>
</figure>

<figure class="source-figure">

[![PA34 分压修正草图，不代表已经完成电平裕量和整机测试。](/images/zh/doc-30-image-131.webp)](/images/zh/doc-30-image-131.webp)

<figcaption>PA34 分压修正草图，不代表已经完成电平裕量和整机测试。</figcaption>
</figure>

1. 在嘉立创 EDA 专业版建立工程，按原理图与物料编号放置器件，确认符号和封装对应。下载的 PDF 是阅读参考，DXF 是外形资料，不把它们当成完整可编辑电路工程。
2. 分别绘制电源、主控、屏幕、麦克风、LM4871N、按键与串口连接，先处理 PA34 修订；检查信号方向、供电网名、去耦、极性与电平，再执行原理图电气规则检查。
3. 将核对后的原理图更新到 PCB，按 DXF 的单位与边框核对板形；先放屏幕、开关、按钮、电池盒和外壳固定点，再布置其他器件。检查机械干涉后布线，完成 PCB 规则检查及原理图/PCB 一致性检查。
4. 导出 BOM、位号图、制造文件与需要的装配资料；复核孔径、线宽间距、铜皮与丝印，外壳不能靠缩放图片确定尺寸。
5. 按焊接顺序装配低矮器件、连接器和模块，断电检查极性与短路。
6. 分模块测试电源、显示和音频，再安装外壳。麦克风孔、扬声器和按钮不能被结构件遮挡。

## 3. 外壳与面板 {#enclosure}

外壳 STL 用于打印，DXF 用于 PCB/外形协同，面板工程用于印刷和开孔层。核对导入单位、螺丝柱、屏幕窗口、按钮行程和接口位置。原课程的软件按钮和优惠次数属于当时版本，不作为今天下单承诺。

<figure class="source-figure">

[![原外壳三维设计。](/images/zh/doc-30-image-069.webp)](/images/zh/doc-30-image-069.webp)

<figcaption>原外壳三维设计。</figcaption>
</figure>

<figure class="source-figure">

[![面板与 PCB 配合示意。](/images/zh/doc-30-image-090.webp)](/images/zh/doc-30-image-090.webp)

<figcaption>面板与 PCB 配合示意。</figcaption>
</figure>

<figure class="source-figure">

[![面板尺寸示意；实际加工使用工程文件。](/images/zh/doc-30-image-103.webp)](/images/zh/doc-30-image-103.webp)

<figcaption>面板尺寸示意；实际加工使用工程文件。</figcaption>
</figure>

原课程的外壳建模录屏按部件排列，操作对应当时 CAD 版本：

<SourceMaterials article="DOC-30" only="DOC-30-file-010,DOC-30-file-011,DOC-30-file-012,DOC-30-file-013,DOC-30-file-014,DOC-30-file-015,DOC-30-file-016" />

## 4. 编译、下载与烧录 {#flash}

1. 在 [SF32 固件项目](https://github.com/78/xiaozhi-sf32)选择支持插件版的明确版本。
2. 阅读该版本说明，使用 [sftool 官方发布](https://github.com/OpenSiFli/sftool/releases)及对应平台工具。
3. 用固件包提供的多文件地址表烧录；**不要套用 ESP32 的完整镜像 0x0 命令**。
4. 保存版本、文件清单和启动日志；先验证显示和音频，再安装外壳。

下载固件时，按 SF32 项目的对应版本选择支持本硬件的构建。

<SourceMaterials article="DOC-30" only="DOC-30-file-021" />

## 5. 蓝牙 PAN 上网并绑定 {#network}

这套方案通过手机蓝牙网络共享上网，不是 S3 的 BluFi 配 Wi-Fi。

1. 按手机系统说明开启蓝牙网络共享/个人热点相关能力。
2. 连接固件提示的 `sifli-pan` 等设备名，以当前固件实际广播为准。
3. 观察板上连接状态，确认共享网络确实可用；蓝牙配对完成不等于已经共享互联网。
4. 按板卡对话键取得设备六位码，继续[控制台绑定](../../getting-started/wifi-and-binding#bind)。

<figure class="source-figure">

[![原版固件启动画面。](/images/zh/doc-30-image-113.webp)](/images/zh/doc-30-image-113.webp)

<figcaption>原版固件启动画面。</figcaption>
</figure>

<figure class="source-figure">

[![原版 PAN 未连接状态。](/images/zh/doc-30-image-124.jpg)](/images/zh/doc-30-image-124.jpg)

<figcaption>原版 PAN 未连接状态。</figcaption>
</figure>

<figure class="source-figure">

[![原版设备状态画面。](/images/zh/doc-30-image-125.jpg)](/images/zh/doc-30-image-125.jpg)

<figcaption>原版设备状态画面。</figcaption>
</figure>

<figure class="source-figure">

[![原版休眠画面；行为以所用固件为准。](/images/zh/doc-30-image-127.jpg)](/images/zh/doc-30-image-127.jpg)

<figcaption>原版休眠画面；行为以所用固件为准。</figcaption>
</figure>

## 怎么确认完成 {#verify}

在核验后的供电/按键电路上，设备可以启动、蓝牙联网、绑定和对话；休眠后能按说明唤醒、重连，外壳不妨碍接口和声学通路。手机系统和蓝牙 PAN 支持范围需要记录实测版本。

## 维护与后续步骤 {#sources}

软件由 [xiaozhi-sf32](https://github.com/78/xiaozhi-sf32) 维护；使用工程文件前查看各文件的许可与适用修订。需要普通 ESP32 方案时返回[基础 S3 面包板](../../hardware/breadboard-esp32-s3)。
