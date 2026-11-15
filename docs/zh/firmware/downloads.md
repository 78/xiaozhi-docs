---
id: "downloads"
title: "下载与选择固件"
description: "按照芯片、板型和变体选择固件，区分当前安装与历史版本。"
status: "review"
reviewedAt: "2026-11-15"
reviewNote: "正式 Release v2.6.0 已核验；并未逐个运行所有板型二进制，下载前仍需确认自己的硬件。"
---

# 下载与选择固件

固件必须匹配板型和硬件变体。同样使用 ESP32-S3 的两台设备，也可能因为屏幕、音频芯片和引脚不同而不能互刷。

<a name="scope"></a>

## 首选在线编译与烧录 {#scope}

大部分设备（包括面包板）推荐直接进入[小智固件编译](https://xiaozhi.me/console/firmware-builder)，按自己的板型生成固件并在线烧录，步骤见[在线编译指南](./online-builder.md)。

只有需要固定历史版本、离线安装或修改源码时，再使用下列其他方式。部分土豆子、KevinBox2 等修订没有引出 USB 下载引脚，先看[下载接口说明](./flashing.md#prepare)。

| 你的需要 | 获取方式 |
| --- | --- |
| 大部分设备的首次安装或常规更新 | [在线编译](./online-builder.md)：按板型选择语言、唤醒词及该板支持的选项 |
| 使用发布好的默认固件 | [v2.6.0 正式固件](./releases/v2.6.0.md)：选择与板型、屏幕及联网方式匹配的包 |
| 使用自己的硬件或修改代码 | [本地构建](../development/build-firmware.md)，并使用独立板型身份 |

截至 **2026-11-14**，本页核对的正式版本是 **[v2.6.0](https://github.com/78/xiaozhi-esp32/releases/tag/v2.6.0)**。后续是否已有更新，以 Releases 的正式发布说明为准；本文不把某个固定版本永久称作“最新版”。

<a name="identify"></a>

## 1. 识别板型和变体 {#identify}

下载前收集以下信息。成品设备从卖家或板卡说明获取；自己接线的设备对照源码配置确认。

| 项目 | 为什么要核对 |
| --- | --- |
| 芯片 | `esp32s3`、`esp32c3`、`esp32` 等目标不同 |
| 板型 ID 与构建变体 | 决定引脚、外设初始化和固件升级身份 |
| Flash / PSRAM | 容量和接口影响资源、分区与启动 |
| 显示与音频 | 屏幕驱动/分辨率、麦克风与 Codec 必须匹配 |
| 网络与配网方式 | Wi-Fi/4G、热点/BluFi 由板型和构建选项决定 |

例如：[基础 S3 面包板](../hardware/breadboard-esp32-s3.md)的 128×32 OLED 对应 `bread-compact-wifi`，128×64 对应 `bread-compact-wifi-128x64`。不能把它们换成 LCD 或摄像头版文件。

<a name="release"></a>

## 2. 从正式发布页下载 {#release}

1. 从 [v2.6.0 下载入口](./releases/v2.6.0.md)按产品名称、芯片和系列查找对应文件，或打开[官方发布页](https://github.com/78/xiaozhi-esp32/releases/tag/v2.6.0)，先阅读更新内容、支持范围和升级提示。
2. 在分类表中找到准确的开发板及变体，核对芯片，点击对应的完整 ZIP 文件名下载并解压。不要把 GitHub 自动生成的 **Source code** 压缩包当作已编译固件。
3. 确认包内文件是完整镜像、OTA 应用镜像还是多文件产物，按[镜像类型说明](./flashing.md#image-types)选择写入方式。
4. 没有找到准确变体时，改用在线编译或向板卡维护者确认，不选择名称最接近的文件试刷。

<a name="checksum"></a>

### 检查文件完整性 {#checksum}

如果发布页或构建产物提供 SHA-256，先比对。以下命令仅计算本地文件的摘要：

::: code-group

```powershell [Windows PowerShell]
Get-FileHash .\merged-binary.bin -Algorithm SHA256
```

```sh [macOS]
shasum -a 256 merged-binary.bin
```

```sh [Linux]
sha256sum merged-binary.bin
```

:::

本地算出一个哈希并不证明文件可信；需要与可信发布渠道提供的值比对。没有参考值时，保留来源、版本和文件名以便追溯。

<a name="upgrades"></a>

## 3. 旧版本与跨版本升级 {#upgrades}

| 场景 | 处理方式 |
| --- | --- |
| 同一板型、兼容布局的小版本更新 | 按该版本发布说明使用 OTA 或网页升级 |
| v1 旧布局迁移到 v2 布局 | 先核对硬件与目标完整镜像，按迁移要求手动安装，准备重新配网 |
| 改引脚、屏幕或板型 | 先确认适配方案；不让标准固件覆盖定制硬件 |
| 必须维持旧设备兼容 | 保留明确版本和文件摘要，记录不能升级的原因 |

本站维护两个版本入口：当前的 [v2.6.0 固件列表](./releases/v2.6.0.md)与面向 v1 旧设备的 [v1.9.4 固件列表](./releases/v1.9.4.md)。升级与回退都先核对分区变化，不能默认直接 OTA。

<a name="download-access"></a>

## GitHub 下载不通时 {#download-access}

1. 只是需要安装当前支持板型：打开[小智在线编译](https://xiaozhi.me/console/firmware-builder)，选板型和功能，任务成功后按[下载或烧录步骤](./online-builder.md#flash)安装，或从任务菜单下载完整镜像。浏览器不需要自行从 GitHub Release 列表取包。
2. 必须使用某个正式 Release 的原包：保留表中的版本和完整文件名，在可访问 GitHub 的网络下载后，再按可信渠道提供的摘要核验并传给安装电脑。
3. 维护 v1.9.4 旧设备或特定历史构建时，不用在线编译的现行固件冒充同一文件。本站目前没有另行维护可保证内容一致的独立镜像。

在线构建的源码提交和选项可能与正式发布包不同，不保证二者二进制相同。不要仅因文件名相近就从不明网盘或代理下载。

<a name="verify"></a>

## 怎么确认完成 {#verify}

::: tip 完成标志
你能说清固件的来源、版本、目标芯片、板型变体和镜像类型，且这些信息与实物一致。此时再开始烧录。
:::

<a name="next"></a>

## 下一步 {#next}

大部分设备直接进入[在线编译并烧录](https://xiaozhi.me/console/firmware-builder)；需要离线安装时看[烧录与升级](./flashing.md)。如果板型不在列表中，阅读[自定义开发板](../development/custom-board.md)，先建立可以追溯的固件身份。
