# GitHub 与文档站文章链接兼容 · 2026-11-15

264 个普通正文文章链接改为相对于当前文件的 `.md` 路径，分区入口指向 `index.md`。根入口的两个语言选择链接也使用 Markdown 文件引用。外部地址、固件 Release 下载、图片引用、站点导航与组件元数据不改写。

为 367 个显式章节标题补齐标准 `<a name="…"></a>` 具名锚点，让 GitHub 识别原有 `#anchor`。依据见 [GitHub 官方自定义锚点说明](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#custom-anchors)。网站构建仅移除与紧邻标题 ID 完全相同的镜像锚点，继续使用原有标题、目录及稳定 ID，避免增加空段落或改变章节定位。

`npm run check:links` 检查 279 个仓库正文链接、45 个章节链接及 367 个具名锚点，要求文件真实存在、具名锚点紧邻对应标题。英文文件只补齐原有章节锚点，没有翻译正文或刷新 sourceHash。中文当前输出摘要已同步到读者复查及来源清单。

构建对照：114 个 HTML 页面的站内跳转目标与稳定 ID 均与修改前一致；代码标签页每次构建生成的临时 tab ID 不作为稳定章节地址。GitHub 镜像锚点全部从网站渲染结果移除。素材预算与图文对应检查继续通过，图片和文件未新增副本。GitHub 实际点击与正式站部署验证见本次 PR 及其部署结果。
