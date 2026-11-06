# Astro Notebook: mobile TOC, UI language and syntax highlighting

Source baseline: `c97dcb55d568cca36728c91aab03922bcde845eb` (`astro-main-code-only-c97dcb5.zip`). This change set does **not** include article Markdown files, the avatar image or GitHub Pages deployment changes.

## What is implemented

1. **Mobile table of contents** (article pages only): fixed bottom-right trigger, right-side drawer, scrollable H2/H3 entries, active heading highlight and auto-position when opened. Close with Escape, backdrop, close button or chapter selection. Desktop retains the existing sticky sidebar. When JavaScript is disabled, mobile visitors can still use a static inline TOC.
2. **Chinese / English interface labels**: top-right `EN`/`中` toggle, saved under `astro-notebook.language` in `localStorage`. Navigation, home/archive/category/about headings, code-toolbars, image-dialog actions and mobile TOC controls are localized. The original page URL does not change, and the default server-rendered UI remains Chinese.
3. **Shiki/highlight adaptation**: keep the single existing `vesper` theme, use Shiki language grammar for actual code, and style fenced `text`, `plaintext`, `output`, `log`, `ansi` as neutral output. `SageMath` remains a Python-language alias. No automatic guessing from terminal output is attempted.

## Important language scope

This is deliberately *interface-label* switching, **not** full Astro route-based multilingual content. There are no `/en/` pages, no article translations, no new `hreflang` metadata. Post titles, Writeup bodies, category/tag names and user-entered profile fields retain their original language. This approach is a small first step rather than a fully translated bilingual website.

## Recommended Markdown fences

Commands use `bash` (or `shell`):

````md
```bash
python3 solve.py
```
````

Program output, error logs, flags and ciphertexts should not be colored as executable code:

````md
```text
[+] flag = ...
```
````

`plaintext` / `output` / `log` are mapped to `text` for Shiki parsing. For program scripts keep `python`, `c++`, `javascript`, `sage`, `sagemath`, `json` and others explicit. Do not apply a separate syntax theme for each programming language: Shiki already uses distinct language grammars.

## Changes and limitations

- Updated reusable `Base.astro` to render a language toggle and load a small client-side translation script. It does not use a front-end framework.
- Updated `PostList.astro`, archive/category/tag/about/index/404 and the article reader with label markers; default Chinese stays in static HTML for no-JS accessibility.
- Updated article script and responsive CSS to reuse **one** TOC, not duplicate a mobile table.
- Updated `scripts/regression.mjs` to exercise label switching, code kinds and mobile drawer navigation with fixture articles. Validation uses the complete local project on Node 24, including its 46 real posts; the exported code-only package excludes those posts and the avatar.
- Article content and GitHub Pages configuration remain unchanged. The reviewed code is published through the existing main-site workflow.

## Local validation

```powershell
git status
git switch -c mobile-toc-i18n
git apply --check .\astro-c97-mobile-toc-i18n-highlighting.patch
git apply .\astro-c97-mobile-toc-i18n-highlighting.patch
npm ci
npm run check
npm run build
npm test
npm run verify
```

If `git apply --check` fails, do **not** force apply: inspect changes against the current branch first. Verify both root site and `/astro-preview/` if needed.

## Review follow-ups

- Added modal semantics, keyboard focus containment and focus restoration for the mobile drawer; its action label stays correct after a language change.
- Plain output tokens stay neutral even if an ANSI renderer supplied inline colors.
- Without JavaScript, nonfunctional language/close buttons are hidden while the inline TOC and its label remain available.
- Active-heading tracking uses exactly the headings represented by the TOC, excluding empty or unsupported headings.
- Regression coverage includes output aliases, Tab/Shift+Tab cycling, Escape, backdrop dismissal, persisted language and no-JavaScript mobile navigation.
- After Pages file synchronization exceeded its default 10-minute deadline, the deployment wait was extended to 30 minutes. The deployment address, content and access settings are unchanged.
- Follow-up binary/mobile patch: increase glyph brightness, rely on viewport intersection rather than potentially false document visibility to pause the flow, preserve reduced-motion behavior, and use a 48px icon-only mobile TOC trigger with its translated accessible label. Browser-native background throttling is retained; viewport pause/resume and the touch target are tested.
- CSS-tracks-v2 follow-up: position tracks entirely in CSS, show three on mobile, improve brightness and card transmission, and validate first-viewport exposed glyphs with script bundles blocked. The verification report now uses the matching 36/255 transmission threshold.
- Parallel validation exposed Astro's default content store under shared node_modules. cacheDir is now per project root; the production audit also requires the exact real-article manifest so regression fixtures cannot enter a published artifact.
