# Maintaining the site

This guide covers routine upkeep of the XiaoZhi AI documentation. Reader-facing guides live at [docs.xiaozhi.me](https://docs.xiaozhi.me/); the [contribution guide](CONTRIBUTING.md) explains how to propose changes.

## Routine updates

When firmware, hardware, or the Console changes:

1. Check the behavior against the owning repository and pin technical references to the applicable firmware tag or commit.
2. Update the affected instructions, screenshots, downloads, and cross-links together.
3. Record what was verified and any remaining limitations. Age or low traffic alone is not a reason to delete a guide.
4. Run the checks, preview the affected pages, and submit a pull request.

Keep article IDs, URLs, and existing chapter anchors stable. Preserve redirects when retiring an old entry. The maintained download catalogs currently cover v2.6.0 and v1.9.4; changing that policy requires an explicit content decision, not a link to an unspecified latest release. Match board names, chips, hardware revisions, and asset filenames against the corresponding firmware version, and update `audit/firmware-download-catalog.json`.

## Local development

Use Node.js 22, as specified in `.nvmrc`.

```sh
npm ci
npm run dev
npm run check
npm run translations:status
```

For a fixed local address:

```sh
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Use the development server for editing. `npm run preview` serves a production build; after rebuilding, stop and restart the preview server. VitePress 1.x indexes static files at startup, so an older preview process can otherwise serve HTML that references CSS or JavaScript it has not indexed.

The site uses VitePress with small extensions to its default theme. Dependencies are locked in `package-lock.json`; when upgrading, check the Vite override and theme compatibility.

## Repository layout

| Path | Purpose |
| --- | --- |
| `docs/zh/`, `docs/en/` | Guides and matching language paths |
| `docs/.vitepress/` | Theme, navigation, shared data, and rendering configuration |
| `docs/public/images/` | Shared and language-specific images |
| `scripts/` | Content, link, media, and translation checks |
| `glossary/` | Shared terminology |
| `audit/` | Review evidence, asset records, and current output hashes |
| `.github/` | Pull request checks, issue templates, and publishing workflow |
| `site.config.mjs` | Repository, branch, and production hostname |

Keep contributor tooling, private originals, logs, credentials, and personal reader records outside the published `docs/` tree. Do not commit private data to the repository.

## Languages and review

The website has matching article paths and IDs under each supported locale. English translation records currently track the corresponding `docs/zh/` revision. Translate reviewed source content, and refresh `sourceHash` only after comparing the translation against it. Source corrections may be published while translations are pending; the page notices make their status visible.

The root URL uses an explicit language choice when available, otherwise the first supported language in the browser's preference order. Opening an explicit locale URL respects that URL. Reading an article does not change the saved language choice.

Draft and review pages are publicly accessible. Drafts and retired redirects are excluded from indexing, the sitemap, and machine-readable exports. Complete `review` pages are indexable while retaining their visible review notices. Mark a guide published after the required review and verification, not to change crawler access.

## Search and machine-readable content

VitePress renders the full article into static HTML. Keep essential instructions and warnings in that HTML, rather than requiring browser JavaScript. Every indexable page has a canonical URL, eligible language counterparts, descriptive social metadata, and structured data matching the article. Dates reflect Git content changes; never generate a new modification date just because the site was rebuilt.

The production build generates `sitemap.xml`, an allow-all `robots.txt`, a concise `/llms.txt` directory, complete `/zh/llms.txt` and `/en/llms.txt` indexes, and one clean Markdown file per eligible page. For example, `/en/hardware/breadboard-esp32-s3.md` accompanies the `.html` article. These exports come from the same sources, preserve code and verification limits, expand attachment links and shared code examples, and exclude contributor-only frontmatter. Do not maintain a separate AI-only tutorial copy.

`llms.txt` is a discovery proposal, not a ranking requirement or guarantee of model training. Crawler access, search indexing, live AI retrieval, and training selection are separate decisions. Our allow-all policy permits cooperative search and training crawlers to fetch public content; the hosting provider or upstream network can still affect access.

Original text uses the scope in [LICENSE-DOCS](LICENSE-DOCS). Preserve third-party rights and attribution; crawl permission does not relicense media, firmware, or code. The machine-readable copies carry the same scope.

`npm run check:discovery` validates generated HTML, canonical and language links, JSON-LD, sitemap coverage, crawl rules, and machine-readable copies after the build. Submit `https://docs.xiaozhi.me/sitemap.xml` through the site's verified Google Search Console and Bing Webmaster Tools accounts to monitor actual indexing. Ownership verification and provider indexing are external to a successful deployment.

## Media

Use repository-relative image paths in Markdown. The renderer maps files under `public/images/` back to the existing website `/images/` URLs, so GitHub and the site share the same files without duplicate bundles. Keep intrinsic dimensions in `docs/.vitepress/data/image-dimensions.json` so lazy loading does not shift chapter links.

Before adding or replacing images:

```sh
npm run images:audit
npm run images:optimize
```

The optimizer previews candidates and keeps originals outside Git. Review the result before running `npm run images:optimize -- --apply`. Rebuild from the recorded original, not from an already lossy derivative. The cache location can be set with `XIAOZHI_IMAGE_CACHE` and must not be committed.

The image policy in `audit/image-policy.json` sets these defaults:

- Product photos: longest edge up to 1600 px; assembly photos usually up to 2200 px.
- Ordinary photos: up to 512 KiB. Preserve the resolution and visible pixels of protected wiring diagrams and small-text images.
- Total raster budget: 32 MiB; SVG files: up to 64 KiB each. Explain a necessary exception through the policy rather than silently increasing the budget.

The asset ledger's `sha256` identifies the original; `publishedAsset.sha256` identifies the published derivative. Keep both relationships intact. Update the teaching-illustration records when changing the parts, wiring, variants, or finished-build images in a hardware tutorial.

Keep `audit/media-inventory.json`, `audit/release-assets.json`, and `docs/.vitepress/data/materials.json` consistent when updating attachments. Record core tutorial image coverage in `audit/hardware-illustrations.json` and generated wiring diagrams in `audit/wiring-diagrams.json`.

English attachment labels and notes live in `docs/.vitepress/data/materials.en.json`. Keep original filenames, URLs, sizes, and checksums in the shared registry. Localized diagrams live under `docs/public/images/en/`; compare their signal labels and wire paths with the source and record the relationship in the translation review.

Put video, large design files, and other large attachments in Releases or the approved external storage, with useful labels and checksums. Firmware downloads should point to the official firmware repository's versioned Releases. Keep discussion contacts in the shared header configuration.

Replacing a file does not remove its old versions from Git history. Coordinate any history cleanup separately, retain verified backups outside the repository, and do not reintroduce large originals into Git.

## Publishing

The production site is served by GitHub Pages at **https://docs.xiaozhi.me/**. Merged changes on `main` run checks and publish through `.github/workflows/deploy.yml` when the repository variable `PAGES_DEPLOY_ENABLED` is `true`.

Current configuration:

- Pages source: **GitHub Actions**.
- Custom domain: `docs.xiaozhi.me`, configured in repository Pages settings.
- DNS: the `docs` CNAME points to `78.github.io`, without a repository name or path.
- HTTPS: enforced after GitHub issues the certificate.
- Deployment environment: `github-pages`, limited to `main`.

The workflow uses GitHub's built-in credentials; it does not need a personal access token. Deployment permissions are scoped to the deploy job. The custom-domain base path is `/`; it does not target a `/xiaozhi-docs/` project-site path.

For a new deployment target, update `site.config.mjs`, configure the Pages domain and DNS, and enable the deployment variable. With an Actions-based deployment, the binding is controlled by Pages settings rather than a repository `CNAME` file. CI uses `GITHUB_REPOSITORY` for edit and feedback links.

After publishing, check the homepage, direct article links, chapter anchors, image loading, search, and language selection. Watch the [deployment workflow](https://github.com/78/xiaozhi-docs/actions/workflows/deploy.yml) for the exact published commit and result. Changes to the main website's `/docs` route belong in that website's service.
