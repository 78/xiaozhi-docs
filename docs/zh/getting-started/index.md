---
id: "getting-started"
title: "开始使用小智"
description: "按设备的当前状态，找到从上电到第一轮对话的路径。"
status: "published"
---

# 开始使用小智

目标很简单：让设备联网，在自己的控制台完成绑定，并听到第一句回答。

## 从你的设备开始 {#choose-path}

| 你手上的设备 | 第一步 |
| --- | --- |
| 已刷好固件的成品设备 | 按板卡说明上电，直接[配网与绑定](./wifi-and-binding) |
| 空白开发板，已有配套硬件 | 确认型号后[在线编译与烧录](../firmware/online-builder) |
| 想自己从零接线 | 按[基础 ESP32-S3 面包板](../hardware/breadboard-esp32-s3)准备器件 |
| 已改引脚或自己画了 PCB | 走[自定义板型](../development/custom-board)，建立独立适配 |

## 四步完成第一轮对话 {#first-conversation}

1. **确认硬件**：找到芯片、板型及屏幕/音频规格。
2. **准备固件**：查看[下载选择](../firmware/downloads)，按[烧录指南](../firmware/flashing)安装。
3. **连接网络**：完成[热点或 BluFi 配网](./wifi-and-binding)。
4. **绑定并对话**：在控制台输入设备六位码，按键或用已配置的唤醒词开始对话。

::: tip 已经可以对话了？
试试[MCP 计算工具](../mcp/quickstart)，或用[USB 移动电源](../hardware/battery-power)让设备便携运行。
:::

## 遇到问题 {#troubleshooting}

按[常见问题](../faq/)从串口、供电、网络、绑定或音频分别排查。反馈时说明卡在哪一步，比“不能用”更容易定位。

这批中文教程正在社区校对，英文将在中文确认后编写。每篇正文顶部说明核对范围，底部可反馈问题。
