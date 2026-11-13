---
id: "breadboard-esp32-s3"
title: "搭建基础 ESP32-S3 面包板小智"
description: "用一套固定的麦克风、功放和 OLED 接线完成小智的第一轮对话。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "引脚已对照 v2.6.0 板型源码和器件资料；整套接线、电源负载与不同实物模块尚待真机复现。"
---

# 搭建基础 ESP32-S3 面包板小智

先完成一套 Wi-Fi、单麦克风、单扬声器和 OLED 的基础设备，再增加屏幕、摄像头或 4G 模块。不同扩展方案使用的引脚和固件可能不同。

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

## 1. 识别排针与电源 {#prepare}

断开所有电源后再接线。按板上 `GPIO` 编号与电源丝印找位置，不按照片左右或排针序号推断；面包板的电源长轨也可能在中间断开。

- INMP441 与本文 OLED 的供电用 `3V3`，不要接 5V。
- MAX98357A 模块的电源用板上的 `5V` 电源节点。此处仅适用于电源连线与官方原理图一致、由 USB 单独供电的 DevKitC-1；先核对板卡原理图，无法确认的兼容板不要照接。
- 各模块信号地与开发板 `GND` 相连；功放的扬声器负端不属于信号地。
- 不从稳压器裸引脚取电，不另外向板上 5V/3V3 注入第二路电源。

电源节点参照[官方原理图](https://dl.espressif.com/dl/schematics/SCH_ESP32-S3-DevKitC-1_V1.1_20220413.pdf)。USB 供电能力、线材和功放负载会影响稳定性，初次测试从低音量开始。

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

## 4. 连接 OLED {#display}

| OLED 引脚 | ESP32-S3 连接点 |
| --- | --- |
| VCC | 3V3（使用支持此电压的模块） |
| GND | GND |
| SDA | GPIO41 |
| SCL | GPIO42 |

本板型使用 I2C 地址 `0x3C`。128×32 与 128×64 屏幕选择不同固件变体；SH1106、SPI 屏幕或其他地址不能仅靠改接线变成同一方案。

![基础 S3 固件的信号引脚分组，不代表开发板排针物理位置](/images/shared/breadboard-s3-signals.svg)

## 5. 检查、烧录与配网 {#start}

1. 断电检查每一根电源线和信号线，确认电源轨未短路、功放两个输出未接地、接线没有误入相邻排针。
2. 使用[在线编译](../firmware/online-builder)选择上表板型及屏幕变体，或从[下载页](../firmware/downloads)获取匹配固件。
3. 按[烧录教程](../firmware/flashing)完成写入，重新启动后观察屏幕与提示音。板载 RGB 的管脚随 DevKit 修订版变化，不以其颜色单独判断成功。
4. 按[配网与绑定](../getting-started/wifi-and-binding)连接网络、填写设备验证码。
5. 先按 BOOT 开始一轮对话，再测试所选固件支持的唤醒词。

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

## 下一步 {#next}

需要便携运行时查看[电池供电](./battery-power)。需要改变引脚或新增外设时，先读[自定义板型](../development/custom-board)，为改动创建独立固件身份。
