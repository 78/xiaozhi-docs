---
id: "legacy-p3-prompts"
title: "旧版 P3 提示音流程"
description: "为维护旧固件保留 P3 概念和迁移入口，不用于现行默认资源流程。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "历史资料，不能直接作为现行版本的操作步骤；下载以明确版本与适用硬件为准。"
sourceArticles: ["DOC-42"]
archive: true
---

# 旧版 P3 提示音流程

本页是历史用法说明。原教程把 P3 放入 `main/assets/zh-CN` 并修改生成的 `lang_config.h`；当前默认 locale 资源流程已经改用 OGG，不能直接照搬旧路径。

## 什么情况下查阅 {#scope}

只有维护明确使用 P3 的旧固件时才参考。先检出它的 tag，检查实际目录、生成器及播放器，不能仅凭文章发布日期推定兼容范围。

当前仓库仍保留 [P3 工具说明](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/scripts/p3_tools/README.md)，因此归档不表示工具已被删除。

## 历史操作的边界 {#legacy}

旧流程包括调整音频、调用 `convert_audio_to_p3.py`、加入旧资源目录、重新生成并引用声音。采样率、帧格式和符号名必须与该旧固件一致，不把某个 ffmpeg 参数当作所有播放器通用规格。

生成头文件不是长期维护的源文件。即使旧版本通过直接修改暂时可用，也应找到真正的生成输入和可复现构建方式。

## 迁移到现行版本 {#next}

请使用[自定义提示音](../custom-prompts)，按当前 locale、OGG/Opus 和资源生成器处理。先保留原始录音，再转换，不靠更改扩展名把 P3 变成 OGG。

原截图已归类为旧版路径说明，不迁成当前菜单或代码位置图。

---

资料来源：[DOC-42 · 小智修改默认提示音频，转换自己的P3音频文件（例如开机播报和配网播报）](https://icnynnzcwou8.feishu.cn/docx/E2o4dGZPkoJgA2x2iEocjQtnnqJ)。原图和原附件保留来源贡献者署名；文件的使用条件按各自原声明，未统一改为文档仓库许可。
