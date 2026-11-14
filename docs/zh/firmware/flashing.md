---
id: "flashing"
title: "烧录与升级固件"
description: "识别镜像类型，选择网页或离线方式烧录，并检查设备是否正常启动。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "流程已对照 Console 分区烧录实现与 esptool 文档；浏览器、驱动和跨布局升级仍待真机复现。"
---

# 烧录与升级固件

烧录前先确认“给哪块板写、写哪种镜像、是否会改变现有配置”。**优先使用[小智在线编译与烧录](https://xiaozhi.me/console/firmware-builder)**：支持大部分设备，包括面包板，不需要安装源码开发环境。

## 选择你的路径 {#scope}

| 当前情况 | 建议路径 |
| --- | --- |
| 空板，或准备重新安装 | [在线编译并网页烧录](https://xiaozhi.me/console/firmware-builder)；没有可用 USB 下载连接时再按板卡说明安装 |
| 当前固件正常，只更新同板型版本 | 先查看该版本升级说明；可使用兼容的 OTA 或网页烧录 |
| 从旧分区布局迁移，或更换固件板型 | 核对发布说明，准备重新配网；需要时使用完整镜像手动安装 |
| 修改源码后测试 | 按[本地构建](../development/build-firmware)使用 `idf.py flash monitor` |

先记录固件版本、板型 ID、Flash/PSRAM、屏幕规格及当前配网情况。需要恢复的角色设置留在自己的控制台中；不要将“重刷固件”与“解绑账号”混为一谈。

## 准备工作 {#prepare}

- 一台 Windows、macOS 或 Linux 电脑，一条支持数据传输的 USB 线。
- 网页烧录使用支持 Web Serial 的桌面 Chrome 或 Edge，通过 HTTPS 打开官方控制台。浏览器能打开网页不代表支持串口烧录；手机、Safari、Firefox 等不作为本文网页路径。
- 识别开发板的原生 USB 与 USB-UART 接口；接口位置和驱动芯片按板卡说明确认。
- 关闭占用同一端口的串口监视器、IDE 和其他烧录页。驱动从芯片厂商或板卡官方获取。

::: info 有 USB 接口就一定能网页烧录吗？
不一定。先确认它能连接到芯片的下载串口，而不只是充电。部分土豆子（`tudouzi`）、KevinBox2 等硬件修订没有引出所需 USB 引脚，不能直接按普通数据线连接烧录。使用该板维护者说明中的下载接口、外接工具或已运行固件的更新方式，不按外壳或型号名字推断。
:::

## 1. 确认镜像类型 {#image-types}

| 文件类型 | 用法 | 配置影响 |
| --- | --- | --- |
| 完整合并镜像，如 `merged-binary.bin` | 按该包说明的起始地址完整安装；本文 S3 示例为 `0x0` | 连续写入的覆盖范围可能包含 NVS，不承诺保留配网 |
| 应用/OTA 镜像 | 交给匹配的 OTA 或开发流程 | 不能当完整镜像直接从 `0x0` 写入 |
| 多文件构建产物 | 使用生成的下载参数或 `idf.py flash` | 每个文件有各自偏移地址，不能猜地址 |

NVS 存放 Wi-Fi 等设备配置。Console 当前的网页烧录会解析完整镜像并分区写入，跳过 `nvs`、`nvs_keys`；但布局变化时新固件仍可能重新初始化配置。离线把同一个完整文件连续写入，行为并不相同。

## 2. 网页烧录 {#web}

1. 在[在线编译](./online-builder)完成板型选择和编译，进入成功任务的烧录操作。
2. 对照任务详情再次确认芯片、板型变体和语言，将设备用数据线接到电脑。
3. 点击连接并烧录，在浏览器弹窗中选择对应端口。拿不准时，先取消弹窗，插拔设备观察哪个端口出现。
4. 如未进入下载模式，按下文操作后重新连接。烧录开始后保持线缆稳定，等待界面报告完成。
5. 关闭连接，按 RESET/EN 或重新上电，观察启动提示。

网页若提示芯片不匹配或分区表无效，应返回检查固件，不能用更换地址或抹除全片绕过检查。

### 手动进入下载模式 {#download-mode}

对于有 BOOT 和 RESET/EN 按键的常见 ESP32-S3 开发板：按住 **BOOT** → 短按 **RESET/EN** → 松开 **BOOT**，再选择新出现的端口。某些原生 USB 端口在应用与 ROM 模式下会改变名称。

这与“启动后短按 BOOT 进入配网”是不同操作。其他芯片、成品机或特殊启动电路使用各自板卡说明。

<figure class="source-figure">

[![Web Serial 授权窗口：选开发板对应串口。若看不准，取消后插拔观察，再重新授权。](/images/zh/doc-18-image-011.webp)](/images/zh/doc-18-image-011.webp)

<figcaption>Web Serial 授权窗口：选开发板对应串口。若看不准，取消后插拔观察，再重新授权。</figcaption>
</figure>

## 3. 离线烧录完整镜像 {#offline}

需要离线安装时，从[官方下载入口](./downloads)取得匹配包，解压并确认文件类型。以下命令仅用于 **ESP32-S3、已确认起始地址为 0x0 的完整合并镜像**。

在单独的 Python 环境安装 esptool 5.x：

```sh
python -m pip install "esptool>=5,<6"
python -m esptool version
```

切换到镜像所在目录，将示例端口 `COM5` 替换为自己的端口：

```sh
python -m esptool --chip esp32s3 --port COM5 write-flash 0x0 merged-binary.bin
```

macOS/Linux 的端口通常形如 `/dev/cu.usbmodem…` 或 `/dev/ttyACM0`。如果命令中的 Python 不存在，请使用安装环境的 `python3`；不要把命令里的示例端口原样当成自己的设备。

等待校验完成，再重启设备。一般安装不需要先执行全片擦除；只有版本说明或已定位的问题明确要求时才做，擦除会清掉设备配置。也可使用[乐鑫官方下载工具](https://www.espressif.com/en/support/download/other-tools)，镜像地址和配置影响相同。

### Windows 图形工具 {#windows-tool}

不使用命令行时，可从上面的乐鑫下载页取得 Flash Download Tool，操作说明见[乐鑫工具指南](https://docs.espressif.com/projects/esp-test-tools/en/latest/esp32s3/production_stage/tools/flash_download_tool.html)。下图是 3.9.7 界面示例。

1. 本页 S3 示例选择 ESP32-S3、Develop、UART；确认实际芯片与工具版本。
2. 加入已确认的完整合并镜像，勾选该行，按包说明填地址。本页 S3 合并镜像示例为 `0x0`。
3. 旧版工具勾选 **DoNotChgBin**，保留镜像原始内容，不照截图修改 SPI 频率或模式。3.9.10 及以后版本默认按固件构建配置限制这些选项。
4. 选择设备串口后开始写入，等待工具报告完成。其他芯片、多文件或应用镜像不能照抄本例地址。

<figure class="source-figure">

[![Flash Download Tool 3.9.7 的启动选项：本例为 ESP32-S3 / Develop / UART。](/images/zh/doc-08-image-003.webp)](/images/zh/doc-08-image-003.webp)

<figcaption>Flash Download Tool 3.9.7 的启动选项：本例为 ESP32-S3 / Develop / UART。</figcaption>
</figure>

<figure class="source-figure">

[![为合并镜像选择文件并填写地址；本例只适用于已确认从 0x0 写入的完整 S3 镜像。](/images/zh/doc-08-image-005.webp)](/images/zh/doc-08-image-005.webp)

<figcaption>为合并镜像选择文件并填写地址；本例只适用于已确认从 0x0 写入的完整 S3 镜像。</figcaption>
</figure>

<figure class="source-figure">

[![工具出现 FINISH 后重启设备，再检查实际版本与功能。](/images/zh/doc-08-image-009.webp)](/images/zh/doc-08-image-009.webp)

<figcaption>工具出现 FINISH 后重启设备，再检查实际版本与功能。</figcaption>
</figure>

## 怎么确认完成 {#verify}

::: tip 完成标志
工具报告写入与校验成功，重启后运行的是预期板型和版本；屏幕/提示音正常。之后能够[配网并绑定](../getting-started/wifi-and-binding)，或自动连回原有网络。
:::

## 常见问题 {#troubleshooting}

| 现象 | 下一步 |
| --- | --- |
| 看不到串口 | 换数据线/USB 口，确认驱动和下载模式；查看[串口排查](../faq/#serial) |
| 连接超时或中断 | 关闭占用端口的程序，重新进入下载模式；仍失败时降低传输速度并检查供电 |
| 烧录成功但循环重启 | 保存启动日志，核对芯片、内存、分区与板型；不要连续换随机固件 |
| 升级后需要重新配网 | 核对是否整包覆盖、清空 NVS 或改变分区布局 |

## 下一步 {#next}

继续[配网与绑定](../getting-started/wifi-and-binding)。命令语法和镜像偏移依据见 [esptool 写入说明](https://docs.espressif.com/projects/esptool/en/latest/esp32s3/esptool/basic-commands.html)。
