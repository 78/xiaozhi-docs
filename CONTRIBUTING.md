# 参与文档维护 / Contributing

中文是内容主稿，英文使用相同目录、文件名和文章 `id`。所有修改通过 Pull Request 审核；技术步骤应提供适用的固件版本、板型以及验证依据。

## 文章格式

```yaml
---
id: wifi-and-binding
title: 配网与绑定设备
description: 完成设备联网并绑定到智能体。
status: draft
---
```

正文建议按“适用范围 → 准备工作 → 操作步骤 → 成功标志 → 常见问题 → 下一步”组织。硬件引脚、型号、命令、固件名称保持准确，避免笼统地写“最新版”。

硬件教程要保留“完成效果 → 模块识别 → 总接线图 → 分步接线 → 实物检查”的教学关系；各板型、显示和联网变体的图分别归位。GPIO 表用于核对，不能代替所有接线图和成品照片。旧图有错误时指出具体差异，提供对应版本的修正连线，不因“有旧内容”把整组图省掉。选型页比较整套方案，具体模块图片放在相应搭建教程。每张图都必须解释所在章节；例如音频直连图不能放到 OLED 接线段落。迁移编号、逐图来源和审计过程写入 `audit/`，不展示给读者；必要的作者署名与许可保留简洁说明。

`status` 接受 `draft`、`review`、`published`：

- `draft`：整理提纲或待翻译占位页，公开可访问，不参与站内搜索，并设置 `noindex`。
- `review`：已重写的中文初稿，开放社区校对，参与站内搜索，暂设 `noindex`。填写 `reviewedAt` 和具体的 `reviewNote`，说明核对依据与待验证范围。
- `published`：社区反馈及必要的技术核验完成，维护者确认后发布。不能把分区提纲当作实际教程。

所有教程采用中文先行：中文确认前暂不翻译英文。不要为了显示“完成”跳过真机或电气检查。

新增文章时同时建立另一语言的对应路径（可先是简短草稿），确保语言切换不会进入 404。英文正文中的站内链接应进入 `/en/`。使用 Markdown 链接；指向文章时可省略 `.md` 后缀，例如 `[配网](../getting-started/wifi-and-binding)`；指向分区时保留末尾 `/`。

对应章节使用相同的稳定锚点，例如 `## 报告问题 {#report-an-issue}` 和 `## Report an issue {#report-an-issue}`，确保带章节链接的语言切换仍能定位到相同位置。

图片放在 `docs/public/images/shared/` 或语言目录中。共享接线图不要复制多份；带中文界面或文字的图片需要对应语言素材。不要热链飞书图片；视频、大文件与固件放在官方对象存储或 Releases，正文提供说明和链接。迁移社区作品时保留来源及署名。素材决策记录在 `audit/media-inventory.json`，Release 文件及校验值记录在 `audit/release-assets.json`；页面下载区使用 `.vitepress/data/materials.json`。新文件不要直接推入 Git 历史；先检查来源、适用版本、个人信息和凭据，再附清单上传独立 Release。未采用旧图也需要具体原因，不能默认为丢弃。迁入图片还要记录 `image-dimensions.json` 的实际宽高，避免懒加载把章节锚点推走；核心硬件教程的配件、总图、变体和效果图需同步更新 `audit/hardware-illustrations.json`，`npm run check:assets` 会校验它们确实出现在对应章节。

图片发布前运行 `npm run images:audit`。产品外观照最长边不超过 1600px；装配照通常不超过 2200px，普通照片不超过 512 KiB。接线、细字截图与关键标注图按 `audit/image-policy.json` 的明确类别保留尺寸和像素，不为了压小文件损坏 GPIO 或文字；允许的较大文件必须有对应用途和预算。整站位图预算暂为 32 MiB，SVG 单文件不超过 64 KiB。超限应先优化，再解释需要保留的细节，不能改扩展名冒充压缩。

`npm run images:optimize` 比较 WebP、PNG、JPEG 候选，预览与原件保存在仓库外的本地缓存。检查结果后执行 `npm run images:optimize -- --apply`，同步替换引用、图片尺寸和源图/发布图的校验值。重新生成必须从清单记录的原件开始；没有原件时不要对现有有损图片反复转码。缓存可用 `XIAOZHI_IMAGE_CACHE` 指定，不能提交进 Git。素材清单的 `sha256` 始终是源图摘要，`publishedAsset.sha256` 才是实际发布文件摘要。英文仍需单独审核，不能借图片路径更新刷新翻译哈希。

替换工作目录文件不会清除 Git 中已经提交的大图。需要缩小完整克隆时，应另行评估历史清理；不要未经协调强制推送或删除远端仓库。

讨论入口集中维护在 `docs/.vitepress/data/community.json`：中文展示 QQ 群，其他语言展示 Discord。文章不要嵌入具体群号、社交账号或群二维码。第三方已有维护者持续更新的完整教程时，优先外链；本站保留平台说明与稳定入口，避免复制一套电路、软件和素材后与上游分叉。

## 翻译同步

每篇英文文章增加元数据：

```yaml
translation:
  sourceHash: 对应中文文件完整内容的SHA256
```

尚未翻译的对应页使用 `status: draft` 和 `translation: { status: pending }`，可以不设置 `sourceHash`。页面会显示待翻译说明及中文入口；不要复制中文正文充当英文，也不要填入未经翻译审核的哈希。已有译稿的旧哈希可保留，表示其最后核对的版本。

中文修改后，执行 `npm run translations:status` 区分等待中文确认的占位页与已有译稿的过期状态。**完成翻译和审核后**才更新 `sourceHash`，不要仅为消除提示刷新哈希。该检查提供提醒，不阻止中文修正先发布；已有英文译稿会显示待审核提示和中文原文入口。

共用术语见 `glossary/terms.json`。代码、引脚名、板型标识、文件名和协议字段不翻译。英文发现技术性错误时，同时修正中文主稿。

## 提交前检查

```sh
npm ci
npm run check
npm run translations:status
```

`npm run check` 会检查文章元数据、同名语言路径、审计覆盖率，并执行 VitePress 构建及站内死链接检查。素材检查覆盖清单完整性、保留图片 SHA-256 及下载注册表一致性。它不验证外部网站可用性，也不代替真机测试。PR 请说明改了什么、验证方式以及仍未验证的内容。

## English summary

- Chinese is the source language. Keep identical article paths and IDs in English.
- A missing translation may start as a clearly marked draft. Drafts remain publicly accessible.
- Review technical facts and terminology before marking a page as published.
- Chinese guides may use `review` while awaiting community feedback. Leave English counterparts as `draft` with `translation.status: pending` until that review is complete.
- Record the reviewed Chinese SHA-256 in `translation.sourceHash`; use `npm run translations:status` to find stale translations.
- Keep code, pin names, board identifiers, and protocol fields unchanged. Attribute community material.
- Run `npm run check` before submitting a PR and describe any hardware validation limits.
