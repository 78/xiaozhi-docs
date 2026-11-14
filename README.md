# 小智官方文档 / XiaoZhi documentation

小智 AI 的使用、硬件、固件、控制台、MCP 与开发文档。内容在 GitHub 维护，网站计划发布到 **https://docs.xiaozhi.me**。

44 篇来源文档已建立中文重构、合并或历史归档稿件：P0 11 篇、P1 20 篇、P2 13 篇全部有实际去向。站内共有 55 个中文页面及相同路径英文入口；教程标为“社区校对中”，英文只保留待翻译说明，等中文反馈确认后再编写。

图片和附件随文章整理：保留 105 个原图引用（99 个去重文件），另补 6 张按当前固件生成的连线图；14 段视频、音乐/歌词与设计文件共 56 个去重文件放在独立 [素材 Release](https://github.com/78/xiaozhi-docs/releases/tag/tutorial-assets-2026-11-14)。ESP32 主固件引用 `78/xiaozhi-esp32` 官方 Releases；SF32 与第三方 ESP8266 案例明确区分来源。OTA 与协议内容以固件对应版本为准。

上一轮遗漏了核心面包板接线/效果图，并把模块照片放错到选型页；本次已修复基础 S3、彩屏、C3、经典 ESP32、摄像头和 4G 的图文组织。纠错范围与原图差异见 [面包板图文修复记录](audit/breadboard-illustration-repair-2026-11-14.md)。正文和构建通过不代表全部素材已验收。

逐篇依据、去向和实施状态见 [审计清单](audit/inventory.json)，最新范围及验证见 [P1/P2 重构记录](audit/p1-p2-rewrite-2026-11-14.md)，完整素材取舍见 [素材清单](audit/media-inventory.json)。社区尚未确认，真机、电气与生产流程未全部验证。

## 本地使用

使用 Node.js 22（见 `.nvmrc`）。

```sh
npm ci
npm run dev
```

```sh
npm run check                 # 元数据、语言路径、审计/素材校验、构建及站内死链接
npm run translations:status   # 根据中文内容 SHA-256 检查英文是否待同步
npm run preview              # 预览最近一次构建
```

日常修改文档请使用 `npm run dev`，它会热更新正文和样式。需要固定在本次预览地址时运行：

```sh
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

`npm run preview` 仅用于检查已构建产物。运行 `npm run build` 或 `npm run check` 重新生成产物后，必须停止并重新启动已有的 preview 进程：VitePress 1.x 的静态预览在启动时索引文件，不会自动识别重建后新命名的 CSS/JS，否则会出现页面无样式或脚本 404。开发服务不受此构建目录更新影响。

## 目录

```text
docs/
  .vitepress/                # 网站配置、导航和小范围主题扩展
  zh/                       # 中文主稿
  en/                       # 英文；保持与中文相同的文章路径和 id
  public/images/            # shared/、zh/、en/ 图片
audit/                      # 来源统计、逐篇取舍和重构进度，不进入公开网站构建
glossary/                   # 术语表
scripts/                    # 内容及翻译检查
.github/                    # PR 检查、Pages 部署、反馈模板
site.config.mjs             # 计划中的仓库、主分支和正式域名
```

根路径根据上次阅读语言或浏览器首选语言跳转至 `/zh/` 或 `/en/`，同时保留静态语言入口。直接打开 `/zh/…` 或 `/en/…` 会尊重该链接，不再按浏览器语言跳转。

采用 VitePress 1.6.4 稳定版、Vue 3，锁定依赖并提交 `package-lock.json`。通过 npm override 使用修复后的 Vite 6.4.6；升级 VitePress 时应重新检查该 override 的必要性及兼容性。站点是静态文件，不依赖运行时 Node.js 服务、数据库或飞书登录。

## GitHub Pages 与域名

公开仓库为 [78/xiaozhi-docs](https://github.com/78/xiaozhi-docs)。目标域名配置为 `docs.xiaozhi.me`，尚需完成 Pages 与 DNS 设置。若实际仓库不同，修改 `site.config.mjs`。Actions 构建时会自动使用 `GITHUB_REPOSITORY` 生成编辑及反馈链接。

1. 在公开仓库的 `main` 维护文档。
2. 在 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。
3. 在同一页面将 **Custom domain** 设置为 `docs.xiaozhi.me`。先绑定仓库，再配置 DNS。
4. 在 DNS 添加 `docs` 的 CNAME，指向仓库所属账户的 `<owner>.github.io`。若仓库为 `78/xiaozhi-docs`，目标是 **`78.github.io`**，不含仓库名或路径。
5. 在 **Settings → Secrets and variables → Actions → Variables** 设置仓库变量 `PAGES_DEPLOY_ENABLED=true`，手动触发部署。变量未开启时，推送只执行构建检查。
6. 等待域名检查和证书签发后启用 **Enforce HTTPS**，检查英文、中文、文章深链接和搜索。

这里使用自定义 Actions 发布，GitHub 忽略仓库中的 `CNAME` 文件；真正的域名绑定在 Pages 设置中完成，所以本项目不放置会造成误解的 `CNAME` 文件。`base` 为 `/`，构建针对正式子域名，不适用于未绑定域名的 `/xiaozhi-docs/` 项目路径。

PR 与 `main` 推送运行构建检查；配置域名并开启 `PAGES_DEPLOY_ENABLED` 后，`main` 才会部署。部署权限仅授予 deploy job，使用 GitHub 内置凭证，不需要 PAT。手动发布也仅允许 `main`。

官网的 `xiaozhi.me/docs` 入口以后需在官网服务中另行配置跳转，本仓库无法修改其路由。

参考：[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。

## 内容重构

先在 `audit/inventory.json` 中记录原文问题、取舍依据、新位置与优先级，再编写新页面。每篇原文都要有结论；一篇新教程可以合并多篇原文，也可以把一篇混杂的原文拆成多个主题。

公开站点中的 `draft` 页面不参与搜索；已重写的中文使用 `review` 开放社区校对并可站内搜索，两者均暂设 `noindex`。社区反馈和必要核验完成后改为 `published`，再启动英文翻译；占位英文用 `translation.status: pending` 明确标记，不能伪填已审核的中文哈希。草稿与校对页仍可公开访问，不能存放私密信息。正文、图片、表格、附件和交叉链接都要按采用范围核验。

贡献约定见 [CONTRIBUTING.md](CONTRIBUTING.md)，统计口径与取舍流程见 [audit/README.md](audit/README.md)。
