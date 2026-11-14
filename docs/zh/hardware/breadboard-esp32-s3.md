---
id: "breadboard-esp32-s3"
title: "搭建基础 ESP32-S3 面包板小智"
description: "用一套固定的麦克风、功放和 OLED 接线完成小智的第一轮对话。"
status: "review"
reviewedAt: "2026-11-14"
sourceArticles: ["DOC-05", "DOC-10"]
reviewNote: "引脚已对照 v2.6.0 板型源码和器件资料；整套接线、电源负载与不同实物模块尚待真机复现。"
---

# 搭建基础 ESP32-S3 面包板小智

先完成一套 Wi-Fi、单麦克风、单扬声器和 OLED 的基础设备，再增加屏幕、摄像头或 4G 模块。不同扩展方案使用的引脚和固件可能不同。

## 先看做成后的样子 {#finished-overview}

第一张是只接麦克风和功放的基础版，第二张增加 OLED 显示。先完成这一套，再考虑彩屏、摄像头或 4G；这些变体的接线图在本文末尾分别链接。

<div class="module-grid">

<figure class="source-figure">

[![基础版实物：ESP32-S3、麦克风、功放与扬声器](/images/zh/doc-05-image-035.jpg)](/images/zh/doc-05-image-035.jpg)

<figcaption>基础版实物：ESP32-S3、麦克风、功放与扬声器。点击查看大图。</figcaption>
</figure>

<figure class="source-figure">

[![OLED 扩展实物：在基础音频方案上增加显示屏](/images/zh/doc-05-image-037.jpg)](/images/zh/doc-05-image-037.jpg)

<figcaption>OLED 扩展实物：在基础音频方案上增加显示屏。点击查看大图。</figcaption>
</figure>

</div>

## 本文适用的硬件 {#scope}

| 项目 | 本文选择 |
| --- | --- |
| 开发板 | ESP32-S3-DevKitC-1，WROOM-1 N16R8（16MB Flash、8MB PSRAM） |
| 麦克风 | INMP441 I2S 模块 |
| 功放 | MAX98357A I2S 模块，带默认使能/增益电路 |
| 扬声器 | 单个 8Ω、3W 无源扬声器 |
| 显示屏 | I2C SSD1306，128×32；128×64 需换对应固件变体 |
| 固件板型 | `bread-compact-wifi`；128×64 对应 `bread-compact-wifi-128x64` |
| 其他 | 面包板、短跳线、可靠的 USB 数据线及满足负载的 USB 供电 |

本文引脚对照[固件 v2.6.0 配置](https://github.com/78/xiaozhi-esp32/blob/v2.6.0/main/boards/bread-compact-wifi/config.h)，采用其默认的分离输入/输出 I2S 接法。其他芯片、N8R2、摄像头版、LCD 版及 4G 版应核对各自配置，不能只凭外观沿用本表。

## 材料清单：先认清每个模块 {#materials}

以下图片是这套面包板教程的器件识别资料。按丝印、型号和焊接方向核对，不按商家图片的颜色选型；本页接线步骤固定使用 INMP441 与 MAX98357A。

### ESP32-S3 开发板 {#board-identification}

先读金属屏蔽罩上的完整模组型号，再辨认排针布局。44 针标准版与 42 针果云版的位置图在[下文](#board-layouts)分开给出，它们不因为排针数量不同就一定需要不同 GPIO 固件。

<div class="module-grid">

<figure class="source-figure">

[![模组型号位置：核对 WROOM-1 与 N16R8](/images/zh/doc-05-image-001.webp)](/images/zh/doc-05-image-001.webp)

<figcaption>模组型号位置：核对 WROOM-1 与 N16R8。点击查看大图。</figcaption>
</figure>

<figure class="source-figure">

[![ESP32-S3-DevKitC-1 开发板外观](/images/zh/doc-05-image-002.webp)](/images/zh/doc-05-image-002.webp)

<figcaption>ESP32-S3-DevKitC-1 开发板外观。点击查看大图。</figcaption>
</figure>

</div>

<details>
<summary>辨认部分旧板的 RGB 焊点位置</summary>

<figure class="source-figure">

[![原板 RGB 附近的局部照片，仅用于识别该修订；不要求为点亮 RGB 改焊开发板](/images/zh/doc-05-image-003.webp)](/images/zh/doc-05-image-003.webp)

<figcaption>原板 RGB 附近的局部照片，仅用于识别该修订；不要求为点亮 RGB 改焊开发板。点击查看大图。</figcaption>
</figure>

RGB 能否点亮不是接线成功的统一判据，按键、显示、录放和对话才是本教程的检查项目。

</details>

### 数字麦克风 {#microphone-modules}

<figure class="source-figure">

[![INMP441 模块：核对 VDD、GND、WS、SCK、SD 与 L/R](/images/zh/doc-05-image-004.webp)](/images/zh/doc-05-image-004.webp)

<figcaption>INMP441 模块：核对 VDD、GND、WS、SCK、SD 与 L/R。点击查看大图。</figcaption>
</figure>

ZTS6672 与 ICS43434 也是常见的麦克风模块。下图用于辨认型号；选择替代模块时，核对它的引脚方向、声道与固件配置。

<div class="module-grid">

<figure class="source-figure">

[![ ZTS6672 麦克风模块](/images/zh/doc-05-image-005.webp)](/images/zh/doc-05-image-005.webp)

<figcaption> ZTS6672 麦克风模块。点击查看大图。</figcaption>
</figure>

<figure class="source-figure">

[![ ICS43434 麦克风模块](/images/zh/doc-05-image-006.webp)](/images/zh/doc-05-image-006.webp)

<figcaption> ICS43434 麦克风模块。点击查看大图。</figcaption>
</figure>

</div>

### 数字功放与扬声器 {#audio-modules}

MAX98357A 的输入是数字 I2S，喇叭接功放的两个输出端。 HT517 模块外观也保留用于识别；使用它时应按实际模块规格核对输入、供电、使能和喇叭插头，不能只按图中排针位置互换。

<div class="module-grid">

<figure class="source-figure">

[![MAX98357A 模块与排针、扬声器端子](/images/zh/doc-05-image-007.webp)](/images/zh/doc-05-image-007.webp)

<figcaption>MAX98357A 模块与排针、扬声器端子。点击查看大图。</figcaption>
</figure>

<figure class="source-figure">

[![ HT517 功放模块与插座](/images/zh/doc-05-image-008.webp)](/images/zh/doc-05-image-008.webp)

<figcaption> HT517 功放模块与插座。点击查看大图。</figcaption>
</figure>

</div>

<div class="module-grid">

<figure class="source-figure">

[![原 8Ω 腔体扬声器示例；本页选择 8Ω、3W](/images/zh/doc-05-image-009.webp)](/images/zh/doc-05-image-009.webp)

<figcaption>原 8Ω 腔体扬声器示例；本页选择 8Ω、3W。点击查看大图。</figcaption>
</figure>

<figure class="source-figure">

[![原 4Ω 腔体扬声器示例；需要另核对功放负载和电源余量](/images/zh/doc-05-image-010.webp)](/images/zh/doc-05-image-010.webp)

<figcaption>原 4Ω 腔体扬声器示例；需要另核对功放负载和电源余量。点击查看大图。</figcaption>
</figure>

</div>

### 面包板、导线与按钮 {#breadboard-parts}

两块可拼的 400 孔面包板方便把主控放在中间、两侧插模块。中间每排的两组五孔由沟槽隔开；电源长轨是否连通、是否在中途断开，先用断电通断测试确认。

<div class="module-grid">

<figure class="source-figure">

[![两块可拼面包板的外观](/images/zh/doc-05-image-013.jpg)](/images/zh/doc-05-image-013.jpg)

<figcaption>两块可拼面包板的外观。点击查看大图。</figcaption>
</figure>

<figure class="source-figure">

[![面包板内部金属连接结构：孔位相邻不等于导通](/images/zh/doc-05-image-014.webp)](/images/zh/doc-05-image-014.webp)

<figcaption>面包板内部金属连接结构：孔位相邻不等于导通。点击查看大图。</figcaption>
</figure>

</div>

<div class="module-grid">

<figure class="source-figure">

[![用于面包板的短跳线](/images/zh/doc-05-image-011.webp)](/images/zh/doc-05-image-011.webp)

<figcaption>用于面包板的短跳线。点击查看大图。</figcaption>
</figure>

<figure class="source-figure">

[![杜邦线示例：按模块和主板排针选择端头](/images/zh/doc-05-image-012.webp)](/images/zh/doc-05-image-012.webp)

<figcaption>杜邦线示例：按模块和主板排针选择端头。点击查看大图。</figcaption>
</figure>

</div>

<figure class="source-figure">

[![可选轻触按钮：同侧引脚可能已经连通，安装前确认导通关系](/images/zh/doc-05-image-020.webp)](/images/zh/doc-05-image-020.webp)

<figcaption>可选轻触按钮：同侧引脚可能已经连通，安装前确认导通关系。点击查看大图。</figcaption>
</figure>

### OLED 显示屏 {#oled-modules}

<div class="module-grid">

<figure class="source-figure">

[![0.91 英寸 128×32 OLED 示例](/images/zh/doc-05-image-015.webp)](/images/zh/doc-05-image-015.webp)

<figcaption>0.91 英寸 128×32 OLED 示例。点击查看大图。</figcaption>
</figure>

<figure class="source-figure">

[![0.96 英寸 128×64 OLED 示例](/images/zh/doc-05-image-016.webp)](/images/zh/doc-05-image-016.webp)

<figcaption>0.96 英寸 128×64 OLED 示例。点击查看大图。</figcaption>
</figure>

</div>

这两种屏幕可以共享 GPIO41/42 的 I2C 接线，但要选择匹配分辨率的固件变体。针脚顺序与 VCC/GND 位置按自己的屏幕丝印核对。

4G 模块的识别、供电与变体总图集中在 [ML307R / NT26K 扩展](./breadboard-4g)，第一次搭建 Wi-Fi 版无需购买。

## 1. 识别排针与电源 {#prepare}

断开所有电源后再接线。按板上 `GPIO` 编号与电源丝印找位置，不按照片左右或排针序号推断；面包板的电源长轨也可能在中间断开。

- INMP441 与本文 OLED 的供电用 `3V3`，不要接 5V。
- MAX98357A 模块的电源用板上的 `5V` 电源节点。此处仅适用于电源连线与官方原理图一致、由 USB 单独供电的 DevKitC-1；先核对板卡原理图，无法确认的兼容板不要照接。
- 各模块信号地与开发板 `GND` 相连；功放的扬声器负端不属于信号地。
- 不从稳压器裸引脚取电，不另外向板上 5V/3V3 注入第二路电源。

电源节点参照[官方原理图](https://dl.espressif.com/dl/schematics/SCH_ESP32-S3-DevKitC-1_V1.1_20220413.pdf)。USB 供电能力、线材和功放负载会影响稳定性，初次测试从低音量开始。

## 总接线图：先按当前方案连通 {#wiring-overview}

下面把麦克风、功放、扬声器和 OLED 的每根连接画在同一张图里；后面的表格用于逐根检查。**本页功放 VIN 使用已核对的板载 USB 5V 节点，麦克风与 OLED 使用 3V3。**

<figure class="source-figure wiring-figure">

[![基础 S3：完整音频、供电与 OLED 连线](/images/zh/breadboard-s3-wiring-v2.6.0.svg)](/images/zh/breadboard-s3-wiring-v2.6.0.svg)

<figcaption>基础 S3：完整音频、供电与 OLED 连线。固件 v2.6.0 的信号连线示意，不表示开发板物理排针位置。</figcaption>
</figure>

### 44 针与 42 针板的位置图 {#board-layouts}

以下保留面包板位置总图，便于找排针和摆放模块；图上的同名 GPIO 要与实物丝印逐一对应。

::: warning 位置图中的可选接法
位置图中的功放 VIN 使用 **3V3** 支路；本页固定方案使用已核对的 **5V** 节点，SD/MODE 和 GAIN 按所用模块的工作设置处理。图中还包含可选 ML307R 及 **LDO 焊点取电**：搭建 Wi-Fi 基础版时，跳过整个 4G 分支，不从该焊点取电。
:::

#### 乐鑫标准版 · 44 针 {#layout-44}

<figure class="source-figure wiring-figure">

[![44 针标准板位置总图（Surfer 标注）；Wi-Fi 版不接 4G/LDO 分支，功放供电按本页 5V 方案](/images/zh/doc-05-image-021.jpg)](/images/zh/doc-05-image-021.jpg)

<figcaption>44 针标准板位置总图（Surfer 标注）；Wi-Fi 版不接 4G/LDO 分支，功放供电按本页 5V 方案。点击查看大图。</figcaption>
</figure>

#### GOOUUU 果云版 · 42 针 {#layout-42}

<figure class="source-figure wiring-figure">

[![42 针果云板位置总图（Surfer 标注）；电源排针位置不同；Wi-Fi 版不接 4G/LDO 分支，功放按本页 5V 方案](/images/zh/doc-05-image-026.jpg)](/images/zh/doc-05-image-026.jpg)

<figcaption>42 针果云板位置总图（Surfer 标注）；电源排针位置不同；Wi-Fi 版不接 4G/LDO 分支，功放按本页 5V 方案。点击查看大图。</figcaption>
</figure>

这两张图中麦克风 GPIO4/5/6、功放 GPIO7/15/16、OLED GPIO41/42 的信号关系相同。确认芯片、内存和模块也匹配后，再使用同一 `bread-compact-wifi` 构建；不要把板子左右位置当成 GPIO 编号。

## 2. 连接麦克风 {#microphone}

| INMP441 引脚 | ESP32-S3 连接点 | 用途 |
| --- | --- | --- |
| VDD / VCC | 3V3 | 麦克风电源 |
| GND | GND | 信号地 |
| WS | GPIO4 | 输入声道时钟 |
| SCK | GPIO5 | 输入位时钟 |
| SD | GPIO6 | 麦克风数据进入主控 |
| L/R | GND | 选择左声道，匹配本方案输入 |

名称相近不代表方向相同：麦克风 `SD` 是输出，接固件的输入 `DIN`。INMP441 的供电和声道选择依据见 [TDK 数据手册](https://product.tdk.com/system/files/dam/doc/product/sw_piezo/mic/mems-mic/data_sheet/inmp441.pdf)。

### 麦克风排针焊在另一面时 {#reversed-microphone}

“反装”指排针焊接朝向变化，**不是交换 VDD 与 GND**。先看自己模块哪一面朝上，从丝印找同名信号；下面分别给出两种主板的位置图。

<figure class="source-figure wiring-figure">

[![44 针板：麦克风反面朝上的位置图，电气信号仍按 WS/SCK/SD 对应](/images/zh/doc-05-image-022.jpg)](/images/zh/doc-05-image-022.jpg)

<figcaption>44 针板：麦克风反面朝上的位置图，电气信号仍按 WS/SCK/SD 对应。点击查看大图。</figcaption>
</figure>

<figure class="source-figure wiring-figure">

[![42 针板：麦克风反面朝上的位置图，不能按外观镜像后猜电源脚](/images/zh/doc-05-image-027.jpg)](/images/zh/doc-05-image-027.jpg)

<figcaption>42 针板：麦克风反面朝上的位置图，不能按外观镜像后猜电源脚。点击查看大图。</figcaption>
</figure>

## 3. 连接功放与扬声器 {#amplifier}

| MAX98357A 模块引脚 | ESP32-S3 / 负载连接点 |
| --- | --- |
| VIN / VDD | 上文限定的板载 5V 电源节点 |
| GND | GND |
| DIN | GPIO7 |
| BCLK | GPIO15 |
| LRC / LRCLK | GPIO16 |
| SPK+ / OUTP | 扬声器一端 |
| SPK− / OUTN | 扬声器另一端 |

模块的 `SD/MODE`、`GAIN` 按其厂商默认工作设置处理；如果裸板需要外部电阻或使能信号，先补齐模块电路，不能假定悬空一定能工作。不要用 MAX98357B 直接替换 A；不要把扬声器端接耳机，详见[音频输出](./audio-output)。

### 麦克风与功放的直连接法 {#audio-direct}

不用面包板时，下面这张图可帮助识别两块音频模块的连接。信号对应关系与上面的音频表一致；图中功放的 3V3 供电、SD/GAIN 短接按本页选定的电源和实际模块工作设置处理。

<figure class="source-figure wiring-figure">

[![麦克风与 MAX98357A 的直接连线：图中 3V3 功放支路与短接线按上文说明调整](/images/zh/doc-05-image-028.jpg)](/images/zh/doc-05-image-028.jpg)

<figcaption>麦克风与 MAX98357A 的直接连线：图中 3V3 功放支路与短接线按上文说明调整。点击查看大图。</figcaption>
</figure>

## 4. 连接 OLED {#display}

| OLED 引脚 | ESP32-S3 连接点 |
| --- | --- |
| VCC | 3V3（使用支持此电压的模块） |
| GND | GND |
| SDA | GPIO41 |
| SCL | GPIO42 |

<figure class="source-figure wiring-figure">

[![ESP32-S3 与 SSD1306 OLED 的四根连线](/images/zh/breadboard-s3-oled-v2.6.0.svg)](/images/zh/breadboard-s3-oled-v2.6.0.svg)

<figcaption>OLED 的 VCC、GND、SDA、SCL 四根线。点击查看大图。</figcaption>
</figure>

本板型使用 I2C 地址 `0x3C`。128×32 与 128×64 屏幕选择不同固件变体；SH1106、SPI 屏幕或其他地址不能仅靠改接线变成同一方案。


## 可选外接按键 {#buttons}

板载 BOOT 可先用于发起对话。需要外接按钮时，GPIO0、GPIO40、GPIO39 的另一端各通过按钮接 GND，对应本版 BOOT、音量加、音量减。四脚轻触开关先确认哪两脚内部已连通，不把按钮两端插进面包板同一个连通排。

按键行为以[当前板型实现](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/main/boards/bread-compact-wifi/compact_wifi_board.cc)为准，不用旧图中的“重置 Wi-Fi”字样推断所有状态下的按键行为。

## 接线完成后：检查模块下面的线 {#underside}

功放和麦克风下面可能压着短接线。装上模块前拍照检查电源、GND 与信号是否错一排，面包板长电源轨的跨接是否完整。

<figure class="source-figure">

[![基础版移开模块后的接线实物，可看到模块下方的隐藏短线](/images/zh/doc-05-image-036.jpg)](/images/zh/doc-05-image-036.jpg)

<figcaption>基础版移开模块后的接线实物，可看到模块下方的隐藏短线。点击查看大图。</figcaption>
</figure>

## 5. 检查、烧录与配网 {#start}

1. 断电检查每一根电源线和信号线，确认电源轨未短路、功放两个输出未接地、接线没有误入相邻排针。
2. 使用[在线编译](../firmware/online-builder)选择上表板型及屏幕变体，或从[下载页](../firmware/downloads)获取匹配固件。
3. 按[烧录教程](../firmware/flashing)完成写入，重新启动后观察屏幕与提示音。板载 RGB 的管脚随 DevKit 修订版变化，不以其颜色单独判断成功。
4. 按[配网与绑定](../getting-started/wifi-and-binding)连接网络、填写设备验证码。
5. 先按 BOOT 开始一轮对话，再测试所选固件支持的唤醒词。

## 装配与完成效果 {#assembly-results}

下列照片分别展示整体布局、焊线/杜邦线接法和 OLED 完成状态。它们用于核对“做出来大致是什么样子”；功放与 4G 电源请按上面确定的方案接线，不能用照片的线色代替信号名。

<div class="module-grid">

<figure class="source-figure">

[![标准板基础布局与模块相对位置](/images/zh/doc-05-image-023.jpg)](/images/zh/doc-05-image-023.jpg)

<figcaption>标准板基础布局与模块相对位置。点击查看大图。</figcaption>
</figure>

<figure class="source-figure">

[![标准板的连线与模块位置参考](/images/zh/doc-05-image-024.jpg)](/images/zh/doc-05-image-024.jpg)

<figcaption>标准板的连线与模块位置参考。点击查看大图。</figcaption>
</figure>

</div>

<div class="module-grid">

<figure class="source-figure">

[![果云板的模块布置](/images/zh/doc-05-image-029.webp)](/images/zh/doc-05-image-029.webp)

<figcaption>果云板的模块布置。点击查看大图。</figcaption>
</figure>

<figure class="source-figure">

[![果云板的另一个装配视角](/images/zh/doc-05-image-030.webp)](/images/zh/doc-05-image-030.webp)

<figcaption>果云板的另一个装配视角。点击查看大图。</figcaption>
</figure>

</div>

## 怎么确认完成 {#verify}

::: tip 完成标志
OLED 显示完整、启动提示可听见，设备联网并出现在自己的控制台；按键能开始对话，设备能听到问题并播放回答，播放时不重启。
:::

## 常见问题 {#troubleshooting}

| 现象 | 优先检查 |
| --- | --- |
| OLED 黑屏或只显示一部分 | 型号、地址、SDA/SCL、电源、128×32/64 变体 |
| 能听到提示音但听不见我 | INMP441 的 SD/WS/SCK、L/R、拾音孔遮挡及输入电源 |
| 能识别我但没有回答声音 | 功放 DIN/BCLK/LRC、使能、扬声器端子和音量 |
| 一播放就重启 | USB 电源/线材、功放负载及短路，先降低音量 |

## 面包板变体：按自己的板型继续 {#variants}

| 变体 | 接线图与实物图 | 固件区别 |
| --- | --- | --- |
| 同一基础方案换 128×64 OLED | 本页 OLED、44/42 针位置图 | `bread-compact-wifi-128x64` |
| SPI 彩屏 | [44/42 针彩屏接线图与完成效果](./displays/st7789#wiring-diagrams) | `bread-compact-wifi-lcd`，另核对屏幕参数 |
| 摄像头 + 彩屏 | [摄像头板接线与实物](./breadboard-camera#wiring) | `bread-compact-wifi-s3cam`，音频 GPIO 也不同 |
| ML307R 4G | [44/42 针 ML307R 总图与实物](./breadboard-4g#ml307) | `bread-compact-ml307` |
| NT26K 4G | [44/42 针 NT26K 总图与实物](./breadboard-4g#nt26) | `bread-compact-nt26`，多两根握手线 |
| ESP32-C3 + Codec | [C3 接线图、OLED 与彩屏样机](./breadboard-esp32-c3) | `xmini/c3`，不是 S3 的麦克风/功放接线 |
| 经典 ESP32 | [经典 ESP32 图文教程](./breadboard-esp32) | `bread-compact-esp32` |

另一种 Duplex 接法会共用时钟；本页固定为源码默认的 Simplex 接法。改用 Duplex 时，先按该版本配置建立自己的构建，再重新核对时钟，不能在默认固件上随意并线。

## 下一步 {#next}

需要便携运行时查看[电池供电](./battery-power)。需要改变引脚或新增外设时，先读[自定义板型](../development/custom-board)，为改动创建独立固件身份。
