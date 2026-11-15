---
id: "display-emotions"
title: "情绪字段与设备表情资源"
description: "按固件版本核对语义、资源映射与显示回退。"
status: "review"
reviewedAt: "2026-11-15"
reviewNote: "适用固件 v2.6.0；完整规范和实现由固件仓库维护。"
sourceArticles: ["DOC-39"]
---

# 情绪字段与设备表情资源

服务端表达的情绪语义、Unicode Emoji 和屏幕上的图形资源不是同一个对象。完整消息协议和资源映射以对应固件仓库为准。

<a name="scope"></a>

## 从哪一层查起 {#scope}

| 层次 | 核对内容 |
| --- | --- |
| 协议 | [同版本 WebSocket 文档](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/docs/websocket.md)的消息类型与情绪字段 |
| 显示实现 | [main/display](https://github.com/78/xiaozhi-esp32/tree/4de00aed740595a8713b01f8332b9b2cf30685bc/main/display)的实际 SetEmotion 路径 |
| 字体/动画/图片 | 该构建使用的资源包及其名称映射 |

<a name="message-and-names"></a>

## 消息示例与名称查表 {#message-and-names}

该版本 WebSocket 文档的情绪消息示例为：

```json
{"session_id":"example-session","type":"llm","emotion":"happy","text":"😀"}
```

`emotion` 是用来查找显示资源的名称，不把 `text` 中的 Unicode 图形直接当成资源文件名。要查 `neutral`、`happy`、`thinking` 等默认名称与 Emoji 的对应关系，直接打开[字体资源 2.0.0 的 21 项映射表](https://github.com/78/xiaozhi-fonts/blob/d45dbc64052d57048f20ab1770074172ce9eb53b/mappings/emoji.json)；固件 v2.6.0 的[依赖声明](https://github.com/78/xiaozhi-esp32/blob/v2.6.0/main/idf_component.yml)使用这条字体版本线。自定义资源包和专用屏幕可能有自己的名称与映射，按实际构建确认。

未知值也不是所有屏幕统一回退：v2.6.0 的 [OLED 实现](https://github.com/78/xiaozhi-esp32/blob/v2.6.0/main/display/oled_display.cc)先查 Emoji，再查图标字体，两者都找不到时显示 neutral 占位并返回失败；[LCD 实现](https://github.com/78/xiaozhi-esp32/blob/v2.6.0/main/display/lcd_display.cc)还会查图片资源，两类字体也无对应字形时返回失败，不能保证已经显示所请求情绪。

<a name="verify"></a>

## 调试顺序 {#verify}

1. 确认固件和主题/资源包版本。
2. 观察实际收到的情绪值，再看显示实现能否找到对应资源。
3. 测试常用值与未知值，记录它是回退、保持原图还是返回错误。
4. 在目标屏幕上确认效果，不能用另一种 OLED/彩屏截图替代。

模型分词器不同，不保证某个 Emoji 在所有模型中都是一个 token。资源名也不因显示成相似图形就可以互换。

<a name="next"></a>

## 怎样更新 {#next}

新增情绪值或映射时，在固件/资源仓库同时修改实现、资源和测试，再更新本站固定版本入口。与提示音有关的资源见[自定义提示音](../development/custom-prompts.md)。
