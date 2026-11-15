# Contributing

Help make XiaoZhi AI tutorials clear, accurate, and easy to follow. Corrections, hardware verification, diagrams, translations, and new guides are welcome.

## License your contribution

Original documentation text is shared under [CC BY 4.0](LICENSE-DOCS). By submitting original text or a translation, you agree to contribute it under that license and retain your copyright. Keep attribution and change history in the repository. Do not submit material you cannot authorize under the applicable terms.

Third-party text, images, recordings, diagrams, code, and other files retain their own licenses. Include their source, author, and applicable permission; the documentation-text license does not automatically cover them. Website code and standalone programs are outside this text license.

## Report a documentation problem

Use the feedback link on a guide or [open a documentation issue](https://github.com/78/xiaozhi-docs/issues/new?template=documentation.yml). Include the page URL, the affected step, your device model and firmware version, and what happened. Remove passwords, access tokens, account details, and device identifiers from shared logs and screenshots.

For general device discussions, use the community links in the documentation header.

## Submit a change

1. Fork the repository and edit the relevant Markdown files.
2. Preview your changes with `npm ci` and `npm run dev` using Node.js 22.
3. Run `npm run check` and check the affected pages in the browser.
4. Open a pull request explaining the problem, your change, and the verification you performed.

For hardware instructions, state the board revision, firmware version, and what you tested. Distinguish a source-code comparison from an actual hardware test.

## Write for the reader

Organize a guide around scope, preparation, steps, success checks, common problems, and the next step. Use specific board names, commands, pins, and firmware versions rather than an ambiguous “latest version.”

Hardware tutorials should show the finished build, identify the parts, provide an overall wiring diagram, explain the connections, and end with verification. Keep images beside the step they explain. Tables help check pins, but do not replace useful wiring diagrams or assembly photos. Put component variants in their construction guide; use hardware selection pages to compare complete setups.

Keep code-specific references in the [firmware repository](https://github.com/78/xiaozhi-esp32) and link to the relevant version. Prefer links to actively maintained third-party tutorials over maintaining an unnecessary copy. Preserve attribution and applicable permissions for contributed material.

Keep maintenance notes and detailed review evidence in `audit/`, outside the published site. Do not put those notes in reader-facing prose. Discussion contacts belong in `docs/.vitepress/data/community.json`, not in individual guides.

## Links and images

Use repository-relative `.md` links, including `index.md` for a section landing page. This lets the same links work on GitHub, in forks, and on the website.

```md
[Flashing](../firmware/flashing.md)
[Preparation](../firmware/flashing.md#prepare)
```

Keep article IDs, paths, and chapter anchors stable. Corresponding language versions use the same paths and IDs. Put a matching GitHub named anchor immediately before each heading with an explicit ID:

```md
<a name="prepare"></a>

## Preparation {#prepare}
```

The site removes this mirror and uses the heading's existing ID. `npm run check:links` checks article files and chapter targets.

Store images in `docs/public/images/shared/` or a language-specific directory. Use paths relative to the article file for both the image and its full-size link. For example, a page in `docs/zh/hardware/` can reference `../../public/images/zh/doc-05-image-035.jpg`. Do not use website-root `/images/…` paths in Markdown or hotlink the production site instead of the repository file.

Run `npm run images:audit` before submitting images. Preserve the readability of wiring labels and small text. See [media maintenance](MAINTAINING.md#media) for size limits, optimization, and large attachments.

## Review and translations

Pages have one of three statuses:

- `draft`: an outline or pending translation; publicly accessible but excluded from search.
- `review`: a usable guide awaiting community verification; state the review date and scope.
- `published`: the necessary content review and verification are complete.

Follow the existing metadata conventions. Do not mark a guide as verified merely because the site builds.

Translate a guide after its source content has been reviewed. Pending translations use `status: draft` and `translation: { status: pending }`; do not copy source-language text into the translated page. Review a translation against its source before updating `translation.sourceHash`. Run `npm run translations:status` to identify pending or outdated translations.

Keep code, GPIO names, board IDs, filenames, and protocol fields unchanged. Use the shared terminology in `glossary/terms.json`. Technical corrections found during translation should also be applied to the source guide.

## Before opening a pull request

```sh
npm run check
npm run translations:status
```

The checks cover metadata, language counterparts, article links, chapter anchors, media records, image budgets, firmware downloads, and the production build. They do not replace hardware verification or testing the affected external service.

Publishing and repository operations are described in [Maintaining the site](MAINTAINING.md).
