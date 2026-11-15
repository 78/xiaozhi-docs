---
id: "serial-logs"
title: "采集启动与故障日志"
description: "连接正确端口，记录故障发生前后的完整信息。"
status: "review"
reviewedAt: "2026-11-15"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-23"]
---

# 采集启动与故障日志

日志可以区分启动失败、网络连接、激活和音频问题。先采集，再改变条件；只截最后一行通常会漏掉真正原因。

<a name="scope"></a>

## 准备工作 {#scope}

准备数据线和适合系统的串口工具，确认是原生 USB 还是 USB-UART 桥接器。驱动只从板卡或芯片厂商获取，不把某款工具附带的历史安装包当作所有设备必装项。

<a name="port"></a>

## 1. 找到端口 {#port}

先查看端口列表，插入设备后再比较新出现的端口。Windows 可用设备管理器；macOS/Linux 查看工具的串口选择列表。按板上 USB/UART 丝印和厂商说明识别，不按“左口/右口”推定。

端口可能在 ROM 下载模式与应用运行时变化。日志要看正常启动时的端口；有端口不等于固件已经在运行。

<figure class="source-figure">

[![Windows 设备管理器中查找串口的示例；COM 编号因电脑而异。](../../public/images/zh/doc-23-image-001.webp)](../../public/images/zh/doc-23-image-001.webp)

<figcaption>Windows 设备管理器中查找串口的示例；COM 编号因电脑而异。</figcaption>
</figure>

<a name="capture"></a>

## 2. 连接并重新启动 {#capture}

1. 关闭占用同一端口的烧录页、IDE 监视器和其他终端。
2. 选择端口。基础板通常使用 **115200、8 数据位、无校验、1 停止位**，其他板型以配置为准。
3. 打开串口后短按 RESET/EN，采集从启动开始的信息。
4. 复现一次问题，保留操作前、发生时和恢复后的相关片段。
5. 导出纯文本，附上硬件、固件版本和实际步骤。

已安装 ESP-IDF 时可直接使用：

```sh
idf.py -p COM5 monitor
```

把 `COM5` 换为自己的端口；使用 Ctrl+] 退出。未安装 SDK 的用户不必为采日志安装整个环境，可使用 Python 的 [pySerial miniterm](https://pyserial.readthedocs.io/en/latest/tools.html#module-serial.tools.miniterm)。在独立 Python 环境安装 `pyserial` 后，执行 `python -m serial.tools.miniterm COM5 115200`，替换实际端口；用 Ctrl+] 退出。

### 没有串口工具时：安装并运行 miniterm

先从 [Python 官网](https://www.python.org/downloads/)安装适合系统的 Python 3。新建一个空目录，在该目录的终端执行下面一组命令。Windows 用 `py -3`，macOS/Linux 用 `python3`；两组都不需要激活脚本：

::: code-group

```powershell [Windows PowerShell]
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install pyserial
.\.venv\Scripts\python.exe -m serial.tools.list_ports -v
.\.venv\Scripts\python.exe -m serial.tools.miniterm COM5 115200
```

```sh [macOS / Linux]
python3 -m venv .venv
.venv/bin/python -m pip install pyserial
.venv/bin/python -m serial.tools.list_ports -v
.venv/bin/python -m serial.tools.miniterm /dev/ttyACM0 115200
```

:::

先看端口列表，再把最后一行的 `COM5` 或 `/dev/ttyACM0` 换成自己的端口。macOS 常见 `/dev/cu.usbmodem…` 或 `/dev/cu.usbserial…`；仅作格式参考。连接后短按 RESET/EN；按 **Ctrl+]** 退出并释放端口。

- **没有输出**：核对日志口和正常运行模式，再按 RESET/EN；不要进入 ROM 下载模式。
- **文字乱码**：核对波特率和编码，图形串口工具取消 HEX 显示。
- **端口被占用**：关闭烧录网页、其他串口工具和 IDE 监视器，再连接。

查 MAC 时继续[设备信息获取步骤](./account-and-binding.md#device-information)，区分 STA 地址、热点地址、UUID 和绑定码。

<a name="read"></a>

## 3. 先看什么 {#read}

| 日志阶段 | 关注内容 |
| --- | --- |
| 启动 | 芯片、版本、板型、Flash/PSRAM、分区和第一条初始化错误 |
| 联网 | 扫描、连接、断开、是否反复回到配网 |
| 激活/OTA | HTTP 状态、激活状态，不公开完整凭据 |
| 对话 | 连接、录音、播放、工具调用、异常重启位置 |

看不懂的错误保留原文。不要只提取大量后续错误而删除第一条失败信息。

<a name="verify"></a>

## 怎么确认完成 {#verify}

文本包含启动版本和可复现故障的上下文，别人能按操作顺序定位。分享前遮盖 Wi-Fi 密码、端点令牌、手机号和不必要的设备标识；截图不能代替可复制的错误文本。

<a name="materials"></a>

## 工具与下一步 {#materials}

串口工具请从维护者的官方发行入口下载。固件包写入请回到[烧录指南](../firmware/flashing.md)，不要在串口窗口里输入随机控制命令。
