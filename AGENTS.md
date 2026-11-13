# XiaoZhi documentation

This repository builds the public documentation for `docs.xiaozhi.me` using VitePress. Read `README.md` and `CONTRIBUTING.md` before editing.

- Keep Chinese source pages in `docs/zh/` and English counterparts at identical paths in `docs/en/`; preserve stable article IDs and URLs.
- The existing section landing pages are drafts, not migrated tutorials. Verify instructions before publishing them.
- Record source-document decisions and evidence in `audit/inventory.json`; do not infer obsolescence from low traffic or old modification dates alone.
- Keep `audit/` and contributor tooling outside the published `docs/` tree. Never copy tokens, personal reader records, or credentials into the repository.
- Refresh a translation's `sourceHash` only after reviewing the translation against the corresponding Chinese text.
- Keep code-specific technical references in the owning firmware repository and link to a relevant version instead of maintaining divergent copies.
- Use the default VitePress theme with small extensions. Reuse the shared brand assets; avoid a custom application framework.
- `npm run check` validates metadata, locale pairs, inventory coverage, internal links and the production build. `npm run translations:status` reports stale translations.
- The custom-domain base path is `/`. GitHub Pages is configured through repository settings and `.github/workflows/deploy.yml`.
