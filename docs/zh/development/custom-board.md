---
id: "custom-board"
title: "修改引脚与自定义开发板"
description: "为自己的接线建立独立板型和构建身份，避免被标准固件覆盖。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "适配流程已对照固件开发板指南；这里的配置是结构示例，具体新板需编译和真机验证。"
---

# 修改引脚与自定义开发板

改引脚不只是改几个 GPIO 数字。固件还需要知道音频、显示、按键和电源怎样初始化，以及以后应当匹配哪条升级通道。

## 什么时候需要独立板型 {#scope}

| 改动 | 建议 |
| --- | --- |
| 只选择已支持的语言、唤醒词或屏幕选项 | 使用已有构建参数，不必复制板型 |
| 同一电路的另一种已定义配置 | 使用该板 `config.json` 中已有的独立变体 |
| 改引脚、换 Codec/屏幕、增加电源控制或自制 PCB | 新建板型或由维护者增加独立命名的变体 |

::: warning 不覆盖标准板型的身份
不要改完标准板的 `config.h`，仍把设备上报为原板的标准固件。后续 OTA 可能匹配到原板固件并覆盖定制接线。独立身份是适配的一部分。
:::

完整代码接口由[固件 v2.6.0 开发板指南](https://github.com/78/xiaozhi-esp32/blob/v2.6.0/docs/custom-board_zh.md)维护。本页说明工作顺序，不另建一套板级 API 规范。

## 1. 建立硬件清单 {#hardware}

先记录芯片、Flash/PSRAM、原理图版本、显示驱动/地址/尺寸、音频 Codec、电源控制、按钮和全部 GPIO。检查启动绑带、Flash/PSRAM 占用及 USB 所需引脚，不能仅凭“这个排针空着”选择 GPIO。

对电源与音频信号分开检查。GPIO 电平不等于模块供电电压；主控输入、输出方向也应与外设相反。

## 2. 选择参考板并创建独立目录 {#files}

在[本地构建环境](./build-firmware)中检出对应固件版本并创建工作分支。选择芯片、Codec 和显示接口最接近的板作为参考，按固件指南新建独立目录。

| 文件 | 负责内容 |
| --- | --- |
| `config.h` | 引脚、采样率及板级常量 |
| `*_board.cc` | 外设初始化、按钮行为、音频/显示对象等 |
| `config.json` | 目标芯片、板型类型及构建变体 |
| `README.md` | 原理图、硬件版本、接线、构建与实测结果 |

可以借鉴现有代码，但不要把所有板型文件一起编入同一目标。新板还需要按所属版本接入 Kconfig/CMake 的选择逻辑；仅创建目录和 JSON 不会自动完成全部注册。

```text
main/boards/my-s3-prototype/
├── config.h               # 引脚和常量
├── my_s3_prototype_board.cc # 初始化及板级行为
├── config.json            # 芯片、板型与构建变体
└── README.md              # 硬件修订、接线与验证
```

这是目录结构示例；Kconfig/CMake 注册按对应版本的开发板指南完成。

## 3. 定义可追溯的身份 {#identity}

为目录、板型和变体使用自己的稳定名称。以下只展示 `config.json` 的结构，假定对应板级代码、注册及驱动已完成：

```json
{
  "type": "my-s3-prototype",
  "target": "esp32s3",
  "builds": [
    {
      "name": "my-s3-prototype-oled32",
      "sdkconfig_append": ["CONFIG_OLED_SSD1306_128X32=y"]
    }
  ]
}
```

同一代码目录的不同变体也必须有不同 `name`，并通过明确的配置分支控制实际接线/外设。不要只改名字，却让两种硬件运行完全不匹配的初始化代码。

<figure class="source-figure">

[![定制硬件到固件身份](/images/zh/custom-board-identity.svg)](/images/zh/custom-board-identity.svg)

<figcaption>定制硬件到固件身份。点击查看大图。</figcaption>
</figure>

## 4. 编译与检查分区 {#build}

完成注册后，先用列表确认，再构建自己的变体：

```sh
python scripts/build.py --list-boards
python scripts/build.py my-s3-prototype --name my-s3-prototype-oled32 --language zh-CN
```

检查生成配置的芯片、内存、板型与名称。分区应选用匹配 Flash 容量及固件版本的布局；不要为凑空间直接删除 `ota_0`、`ota_1`。分区变化还影响资源、OTA 和 NVS，需要单独设计迁移。

设备上报、升级匹配与激活细节参照[该版本 OTA 文档](https://github.com/78/xiaozhi-esp32/blob/v2.6.0/docs/ota_zh.md)。在匹配机制确认前，不给定制设备安排标准板 OTA。

## 5. 分阶段验证 {#verify}

1. 断电复核接线和电源，再验证启动、Flash 与 PSRAM。
2. 分别测试显示、按钮、提示音和麦克风，避免同时改多个外设后无法定位。
3. 验证联网、绑定与完整对话，再测选用的唤醒和 AEC。
4. 检查日志/任务信息中的板型和变体名称；确认升级系统能区分自己的设备。
5. 做升级与恢复测试，记录布局、构建参数和可恢复的完整镜像。

::: tip 完成标志
源码可以从干净配置重建，设备上报独立身份，硬件功能通过实测；维护者能根据 README 找到适用电路、构建命令和升级边界。
:::

## 下一步 {#next}

向固件项目提交适配时一并提供电路、板型说明和验证结果。在线编译只在相应板型进入当前选项目录后提供支持；尚未收录时继续使用本地构建。
