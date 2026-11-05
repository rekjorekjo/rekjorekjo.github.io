# Article TOC and footer refinement

Changes based on `astro-notebook-6e75e4f-archive-categories-fixed.zip`:

- Article metadata/header and table of contents now start in the same desktop grid row. The table of contents remains sticky, with its own scrolling viewport. Mobile reading order is: metadata/header, notices (if any), collapsible TOC, article body.
- Current H2/H3 heading highlighting now follows scroll, including long sections. When the active link leaves the TOC viewport, only the TOC pane scrolls to show it. Manual TOC wheel/touch/pointer interaction suppresses automatic relocation temporarily.
- The shared site footer is removed entirely, including the copyright text and Astro credit; obsolete footer options/styles were removed.
- Code block frame, background, toolbar, and button colors now use centralized CSS variables; Shiki continues to own syntax-token highlighting.
- Browser regression checks added for footer absence, desktop header/TOC alignment, and active-link visibility on long TOCs.

Validation performed here: TypeScript syntax transpilation without errors; Chromium static-page smoke test with 32 headings at 1440px and 390px. Desktop header and TOC aligned; scrolling to heading 28 produced a visible active TOC link and `nav.scrollTop > 0`; no horizontal overflow or runtime errors in this test.

Not performed here: full Astro build or project's installed Playwright regression suite. Node version in the available environment is 22.16.0 (project requires >=22.23.4), with no installed project dependencies. Please run `npm ci`, `npm run check`, `npm run build`, and `npm run test` in the local project before replacing your current working tree or deploying. No deployment or git push performed.

## Follow-up: fix desktop article spacing regression

The first layout revision inadvertently applied the 60px desktop column gap as a **row gap**. A missing notice also left an explicit empty grid row; combined with the existing 38px header margin, this grew the normal title-to-body distance from roughly 43px to 158px (and enlarged demo article spacing).

This patch uses named grid areas and a conditional `has-notices` state so empty notice rows are never created. Desktop uses `column-gap: 60px`, `row-gap: 0`, and a 43px header-to-body margin. The <=1050px responsive rule changes only `column-gap` to 30px, not vertical spacing. Mobile retains the header -> notices -> TOC -> body order.

Chromium standalone CSS/DOM smoke results at widths 1440, 1050, 768: **normal article 43px**, **demo article 102px**, TOC aligned within 1px, no overflow. At 760 and 390px: correct mobile ordering and no overflow. The existing browser regression script now asserts both normal/demo desktop gaps at 1440, 1050, 768 to catch future regressions.

Not yet run here: whole-project Astro check/build/regression, because project dependencies are absent and the available Node is 22.16.0 (< project minimum 22.23.4). Please run those in the local project before replacement.
