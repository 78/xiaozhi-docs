---
id: "custom-prompts"
title: "自定义设备提示音"
description: "按当前 locale 资源与 OGG/Opus 生成流程替换提示音。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-42"]
---

# 自定义设备提示音

设备开机、配网等提示音属于固件资源。它与服务器合成回答的音色不同，也不是修改一个文件扩展名就能替换。

## 当前基线 {#scope}

本页对应固件 v2.6.0 的 `main/assets/locales/` 与 [gen_lang.py](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/scripts/gen_lang.py)。默认资源读取 OGG；旧 P3 流程另见[历史说明](./archive/p3-prompts)。

## 1. 准备原始音频 {#audio}

保留原始录音，先试听是否有削波、噪声和过长静音。确定要替换的 locale 及原声音名称，不混用界面翻译、唤醒模型和提示音。

## 2. 转换格式 {#convert}

按[同版本转换脚本](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/scripts/mp3_to_ogg.sh)的 Opus 参数转换，例如：

```sh
ffmpeg -i input.wav -c:a libopus -b:a 16k -ac 1 -ar 16000 -frame_duration 60 output.ogg
```

这是一组该版本采用的参数，不是所有 Opus 播放器的唯一规格。转换后再次试听并检查时长、采样率、声道和解码结果。

## 3. 进入资源生成流程 {#build}

先替换一个已存在的提示音，避免同时改事件名和调用代码。以简体中文配网提示为例，在固件工作分支中：

1. 备份 `main/assets/locales/zh-CN/wificonfig.ogg`，确认它对应自己要替换的配网提示。
2. 将转换后的 `output.ogg` 放到该路径，保留文件名 `wificonfig.ogg`。
3. 按[本地构建](./build-firmware)选择自己的板型，并传入 `--language zh-CN` 重新构建。构建系统会收集该 locale 的 `.ogg`，生成语言头文件并嵌入音频。
4. 安装本次产物，在设备上进入配网，试听实际事件；完成后再逐个替换其他声音。

替换现有音频不需要为它修改 `language.json` 的界面文字。缺少目标语言音频时，该版本会回退到 `en-US`；新增事件或新文件名则还需修改调用与生成流程，见同版本实现。

不要把 `main/assets/lang_config.h` 等生成文件作为唯一修改位置，下一次生成可能覆盖它。资源打包、分区容量和播放器接口仍以固件仓库文档/实现为准。

## 怎么确认完成 {#verify}

从干净构建生成固件，目标 locale 的实际事件能播放正确提示音；其他 locale、唤醒和对话声音没有被误改。保存原始音频、转换命令和构建版本，不能只留一个生成后的二进制。
