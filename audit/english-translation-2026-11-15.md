# English translation review · 2026-11-15

The maintainer requested starting the English edition. This lifts the earlier translation hold; it does not mark Chinese community feedback or hardware verification complete.

## Delivered

- Translated all 54 content pages and retained two version redirects, preserving 56 matching paths, article IDs, and chapter anchors.
- Preserved all 138 image occurrences in the same teaching sections. Added 22 English SVG diagrams by changing labels only; wire paths and coordinates are unchanged. Existing optimized photos and authentic Console screenshots are reused with English captions.
- Localized 40 attachment labels and notes, including 17 audio/lyrics pairs. Original filenames, URLs, bytes, checksums, recordings, and downloads remain intact.
- Translated product names in both firmware catalogs: 199 v2.6.0 packages and 88 v1.9.4 packages, with unchanged chip/revision/filename/URL relationships.
- Localized review notices and attachment controls. English pages are usable, searchable community-review drafts, with source hashes refreshed after comparison. The earlier Chinese process notices now describe the current review workflow.

## Review evidence

The JSON counterpart records source and target hashes per page, source/localized diagram relationships, browser results, and verification limits. Code blocks were compared; only prose comments, descriptions, error strings, and credential placeholders differ. All external references remain, using confirmed English firmware documentation at the same pinned version where available.

`npm run check` covers metadata, language routing, repository article/chapter links, media, bilingual release catalogs, image budgets, and production build. `npm run check:translations` additionally checks current counterparts for anchor, image-order/section, and attachment parity and confirms localized SVG geometry is unchanged. `npm run translations:status` reports 56/56 current counterparts, zero pending, zero stale.

Browser checks covered the S3 OLED chapter, English ES8311 search results, localized resource labels, the MCP code example, and the 199-row download table at a 390px viewport. No new physical or paid-service tests were performed.

## Remaining review

Community proofreading remains open. Translation does not expand the original hardware-verification scope. Real screenshots, videos, original filenames, and externally maintained tutorials can remain Chinese; captions and entry points explain this. No claim is made that every hardware variant or external service has been retested.
