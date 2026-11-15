---
id: "voice-cloning"
title: "声音复刻：录音、训练与选用"
description: "使用符合要求的语音训练自己的音色，并在智能体里验证。"
status: "review"
reviewedAt: "2026-11-15"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-14"]
---

# 声音复刻：录音、训练与选用

声音复刻分为开通、准备音频、提交训练、等待可用和选入智能体几个阶段。先确认账号资格与当前费用，再开始录音。

<a name="scope"></a>

## 准备工作 {#scope}

- 登录[声音复刻页面](https://xiaozhi.me/console/voice-clone)，按当前要求完成实名认证。当前实现限制未成年用户购买或续费。
- 查看购买须知、费用、有效期和可训练次数，使用自己有权提供的录音。
- 准备安静环境、稳定麦克风和能够录音/上传的浏览器；对浏览器授权只在确实需要录音时进行。

费用、次数与处理时长以当前页面提示为准。

<a name="purchase"></a>

## 1. 确认开通状态 {#purchase}

按页面提供的购买或续费流程操作，完成后回到音色列表核对状态。支付结果、训练状态与音色生效不是同一件事；重复点击购买不能加速正在处理的订单。

<a name="audio"></a>

## 2. 准备训练音频 {#audio}

先选择一种方式准备音频。当前上传源文件上限为 **50MB**，浏览器选区为 **8–60 秒**，再转换为 WAV 提交。避免背景音乐、多人串音、削波和明显回声，开头结尾不要截断发音。

<figure class="source-figure">

[![声音复刻：两种输入，共用后续训练流程](../../public/images/zh/voice-training-flow.svg)](../../public/images/zh/voice-training-flow.svg)

<figcaption>声音复刻：两种输入，共用后续训练流程。点击查看大图。</figcaption>
</figure>

<a name="record"></a>

### 现场录音 {#record}

1. 选择麦克风录音，按页面选择实际朗读的语言、风格和文案。
2. 点击开始录音时允许浏览器使用麦克风。没有权限时，在浏览器地址栏的站点设置中检查麦克风权限和输入设备。
3. 在安静环境清晰朗读，停止后试听；内容或收音不合适时重新录制。点击“下一步”进入音频编辑，调整选区并再次试听。

<a name="upload"></a>

### 上传已有音频 {#upload}

1. 选择本地音频文件，上传浏览器可解码的文件，并确认音频语言。
2. 点击“下一步”进入音频编辑，在波形中选取连续、清晰的有效语音，拖动左右边界调整。
3. 试听选区，确认语言和片段长度符合当前要求，再进入训练。

<figure class="source-figure">

[![音频编辑选区示意：边界外的内容不会提交，先试听所选片段](../../public/images/zh/voice-audio-selection.svg)](../../public/images/zh/voice-audio-selection.svg)

<figcaption>音频编辑选区示意：边界外的内容不会提交，先试听所选片段。点击查看大图。</figcaption>
</figure>

选区示意用于说明裁剪关系，不是界面截图。录音和上传都应在提交前试听实际选区。

<a name="examples"></a>

### 三组音频：哪些部分应当裁掉 {#examples}

先试听反例，找出问题，再试听裁剪后的对照。以下是教学样例，不是录音长度或声道的标准模板。

**样例 1：底噪、过长与末尾截断**

反例包含底噪，末尾语句被截断。不要只从开头截够秒数：选择连续、清晰且句子完整的中间片段；整段都有噪声时，优先重录。

[试听/下载反例](https://github.com/78/xiaozhi-docs/releases/download/tutorial-assets-2026-11-14/voice-practice-file-001.mp3) · [试听/下载正例](https://github.com/78/xiaozhi-docs/releases/download/tutorial-assets-2026-11-14/voice-practice-file-002.wav)

<SourceMaterials article="DOC-14" only="VOICE-PRACTICE-file-001,VOICE-PRACTICE-file-002" />

**样例 2：开头的异常声响**

先听开头的吞音、咂嘴等非正常语音，再将选区起点移到第一句干净、完整的话之前。裁剪后试听，确认没有连同首字一起切掉。

[试听/下载反例](https://github.com/78/xiaozhi-docs/releases/download/tutorial-assets-2026-11-14/voice-practice-file-003.mp3) · [试听/下载正例](https://github.com/78/xiaozhi-docs/releases/download/tutorial-assets-2026-11-14/voice-practice-file-004.wav)

<SourceMaterials article="DOC-14" only="VOICE-PRACTICE-file-003,VOICE-PRACTICE-file-004" />

**样例 3：第一句音质不好**

第一句质量差时，可以从后面一段稳定、清晰的完整语句开始，不必把整段都丢掉。调整左右选区，检查开头和结尾，再试听整段。

[试听/下载反例](https://github.com/78/xiaozhi-docs/releases/download/tutorial-assets-2026-11-14/voice-practice-file-005.wav) · [试听/下载正例](https://github.com/78/xiaozhi-docs/releases/download/tutorial-assets-2026-11-14/voice-practice-file-006.wav)

<SourceMaterials article="DOC-14" only="VOICE-PRACTICE-file-005,VOICE-PRACTICE-file-006" />

**允许提交不等于最佳参考音频**。当前页面允许 8–60 秒；选片时可先用约 **10–15 秒**的清晰、平稳、单人完整语音作为起点，再按所选训练方式和试听结果调整。准备原始录音时优先单声道，避免双声道中另一人或伴奏混入。样例中有立体声和不同长度文件，用来对比裁剪，不应据此推导输入要求。

不要求把所有文件强制转成 24kHz，也不承诺某个采样率一定与当前模型最匹配。上传文件按当前界面处理；过度降噪、重复重采样也可能损坏人声。

<a name="training"></a>

## 3. 提交、等待和处理失败 {#training}

1. 确认试听内容、语言、风格和选区长度，阅读页面的确认内容并勾选后，点击“开始复刻”。
2. 观察列表里的训练状态，必要时手动刷新；保持原音频以便排查。
3. 失败时阅读错误，区分录音条件、格式/长度、次数或服务状态，再按页面允许的方式处理。
4. 训练成功后试听示例，修改便于识别的别名。

不承诺“等五分钟一定完成”。刷新页面也不等于再次训练；是否允许重试、申诉或退款，以当前状态和页面规则为准。

<a name="use"></a>

## 4. 在智能体选用 {#use}

打开目标智能体的“配置”，在角色与声音相关设置中选择可用的复刻音色并保存。确认设备使用的是这个智能体，再开始一轮新对话。只在复刻页面试听成功，不代表设备已经选用了它。

<a name="verify"></a>

## 怎么确认完成 {#verify}

列表状态可用，示例音频正常；智能体保存了目标音色，设备实际回答使用该音色。若列表可用却无法选择，检查账号、有效期和该账号的音色限制。

<a name="materials"></a>

## 常见问题 {#materials}

- **没有录到声音**：检查浏览器权限、输入设备与系统麦克风设置，再录一小段试听。
- **上传后无法解码**：检查文件是否损坏，换成浏览器可解码的格式，再选择有效片段；仅改扩展名不会转换格式。
- **训练失败或音色不可用**：保留错误提示，检查音频条件、训练次数、账号和有效期，按页面允许的方式处理。

反馈时提供状态和操作步骤，不公开身份材料或他人的原始录音。

自行检查后仍失败时，发邮件至 [xiaozhi.ai@tenclass.com](mailto:xiaozhi.ai@tenclass.com)，提供账号的可核对信息、音色名称、失败时间、页面错误和已尝试的步骤。与订单相关的问题附自己的订单信息；不要在公开讨论中提交身份材料或原始录音，补交音频按支持人员要求进行。

### 漏读、错读或音质不佳怎么处理

先分别测试数字、普通句子和实际要说的内容，区分某次合成错误与持续的音色问题。检查训练选区有没有底噪、截断、多人声或异常开头；有问题先重新录制/裁剪并试听，再按页面允许的次数重新训练。保留同一组测试句对比前后，不把反复提交训练当作修复偶发漏读的保证。仍有问题时，提供错误与对应测试情况给支持人员核查。

<a name="next"></a>

## 下一步 {#next}

需要让回答使用自己的资料时继续[知识库](./knowledge-base.md)；账号与归属问题查看[账号排查](../faq/account-and-binding.md)。
