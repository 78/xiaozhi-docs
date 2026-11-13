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

`status` 接受 `draft`、`review`、`published`：

- `draft`：整理提纲或待翻译占位页，公开可访问，不参与站内搜索，并设置 `noindex`。
- `review`：已重写的中文初稿，开放社区校对，参与站内搜索，暂设 `noindex`。填写 `reviewedAt` 和具体的 `reviewNote`，说明核对依据与待验证范围。
- `published`：社区反馈及必要的技术核验完成，维护者确认后发布。不能把分区提纲当作实际教程。

所有教程采用中文先行：中文确认前暂不翻译英文。不要为了显示“完成”跳过真机或电气检查。

新增文章时同时建立另一语言的对应路径（可先是简短草稿），确保语言切换不会进入 404。英文正文中的站内链接应进入 `/en/`。使用 Markdown 链接；指向文章时可省略 `.md` 后缀，例如 `[配网](../getting-started/wifi-and-binding)`；指向分区时保留末尾 `/`。

对应章节使用相同的稳定锚点，例如 `## 报告问题 {#report-an-issue}` 和 `## Report an issue {#report-an-issue}`，确保带章节链接的语言切换仍能定位到相同位置。

图片放在 `docs/public/images/shared/` 或语言目录中。共享接线图不要复制多份；带中文界面或文字的图片需要对应语言素材。不要热链飞书图片；视频、大文件与固件放在官方对象存储或 Releases，正文提供说明和链接。迁移社区作品时保留来源及署名。素材决策记录在 `audit/media-inventory.json`，Release 文件及校验值记录在 `audit/release-assets.json`；页面下载区使用 `.vitepress/data/materials.json`。新文件不要直接推入 Git 历史；先检查来源、适用版本、个人信息和凭据，再附清单上传独立 Release。未采用旧图也需要具体原因，不能默认为丢弃。

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
