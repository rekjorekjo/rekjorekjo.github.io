# UI polish (footer, code borders, search)

Changed files:

- `src/config.ts`: added optional `site.footerNote` (empty by default) and `site.showAstroCredit`.
- `src/layouts/Base.astro`: simplified copyright footer, made the Astro credit an actual external link, unified header search icon/label, and made `/` focus the existing archive search field rather than navigate away.
- `src/styles/article.css`: increased code-wrapper and toolbar separator contrast without changing code content, copy controls, or article layout.
- `src/pages/archive.astro`: integrated search icon, clear-query control, dismissible tag filter, and cleaner URL/filter state updates.
- `src/styles/layout.css` and `src/styles/responsive.css`: compact responsive search field, filter chips, consistent visible search navigation on mobile.
- `scripts/verify.mjs`: added checks for clearing query, clearing tag, and the slash shortcut.

Out of scope: no changes to Binary Flow animation, home page layout, article content, or deployment configuration.

Validation performed in the review environment:
- Static TypeScript parse of the embedded page scripts: passed.
- Node syntax check of the modified browser test script: passed.
- Isolated Chromium browser smoke test of search/filter behavior and 768/390/360px layout: passed.
- Isolated Chromium style check of code block border: passed.

The complete Astro build and end-to-end `npm run check`, `npm run build`, `npm run verify` were not run because the project dependencies are not present in this environment. Run these in your local project after applying the patch.
