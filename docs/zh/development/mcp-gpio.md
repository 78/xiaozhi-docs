---
id: "mcp-gpio"
title: "使用 MCP 控制 GPIO 指示灯"
description: "复用固件里的 LampController 示例，验证设备端工具发现与输出电平。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-33"]
---

# 使用 MCP 控制 GPIO 指示灯

本页演示的是**设备固件内的工具**，与电脑上运行 Python MCP 服务不同。先用一个低压指示灯完成闭环，再做更复杂的外设。

## 准备工作 {#scope}

准备[独立板型](./custom-board)、空闲且可输出的 GPIO，以及符合 GPIO 电压/电流条件、带合适限流的 LED。不要直接由 GPIO 驱动电机、大功率灯或继电器线圈。

先核对启动绑带、USB、存储和其他外设占用。原文的 GPIO17 是例子，不代表所有板都可用。

## 1. 复用当前示例 {#implementation}

固件已经提供 [LampController](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/main/boards/common/lamp_controller.h)，当前基础面包板也有相应注册。先阅读对应板级初始化，不要重复注册相同工具名。

它将输出初始化为低电平，提供：

| 工具 | 用途 |
| --- | --- |
| `self.lamp.get_state` | 读取维护的灯状态 |
| `self.lamp.turn_on` | 输出高电平 |
| `self.lamp.turn_off` | 输出低电平 |

在自己的板型中选择经过核对的引脚，保证控制对象生命周期覆盖工具回调。低有效模块与示例极性不同，需要自己适配，不能只换显示名称。

## 2. 注册更多工具时 {#tools}

按照[固件 MCP 使用文档](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/docs/mcp-usage.md)定义清晰的工具名、用途和 bool/int/string 参数。区分 `AddTool` 与 `AddUserOnlyTool`：普通模型可调用工具和只面向用户发起的特权操作不同。

GPIO 类型、板级注册和协议定义都在固件项目维护；本页不复制整份 C++ 补丁，避免与版本分叉。

## 3. 构建、发现、测量 {#verify}

1. 编译自己的板型变体，检查启动日志，先验证基础对话。
2. 在当前服务的设备工具发现/对话调用记录中确认工具。设备工具不一定出现在外部 Python MCP 端点的列表中。
3. 明确请求打开和关闭指示灯，分别观察调用结果与真实电平/灯状态。
4. 重启检查默认状态；多次开关后验证没有影响音频、显示或启动。

原示例返回的软件状态不等于真实负载反馈；需要知道灯是否实际点亮时还需独立检测。

## 演示素材 {#materials}

<SourceMaterials article="DOC-33" />

原视频是旧代码目录操作演示。旧目录、旧 IDE 和自定义类名截图不再充当当前代码补丁；作者与素材出处保留。

## 下一步 {#next}

改接线和新增硬件回到[自定义板型](./custom-board)，电脑/服务器工具则走[MCP 快速开始](../mcp/quickstart)。

---

资料来源：[DOC-33 · 小智AI终端控制GPIO[简单教程]](https://kcn80f4hacgs.feishu.cn/docx/J2MrdqW27oybcCxu7Sfc4gBcn4g)。原图和原附件保留来源贡献者署名；文件的使用条件按各自原声明，未统一改为文档仓库许可。
