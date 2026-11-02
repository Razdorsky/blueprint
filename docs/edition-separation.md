# Edition separation — 2026-11-02

Owner decision: the Figma edition is finished and must stay exactly as it is. The Blueprint edition is free to change in any way, and it must not depend on the Figma edition.

## What changed

- **Blueprint got its own source tree** under `src/lib/blueprint/`:
  - The pages are copies of `P01`–`P13` with only the Blueprint branch of every `{#if edition === …}` block kept, links fixed to `/blueprint/` and the `edition` prop removed.
  - The shell components (Header, Footer, Menu, Gallery, Newsletter) were copied the same way.
  - `site.ts` was rewritten for this edition only. `site-data.json`, `data/media.json` and `interactions.js` are copies.
  - `styles/base.css` is the shared stylesheet without its Figma-scoped rules. `styles/blueprint.css` was moved from `src/blueprint.css`. `assets/` holds copies of the fonts and patterns.
- **Routes:**
  - `src/routes/[edition]/[...slug]` became `src/routes/figma/[...slug]`; only its `+page.ts` changed, to a fixed edition.
  - `src/routes/blueprint/[...slug]` is new.
  - The previous root layout became `src/routes/figma/+layout.svelte` and imports only `shared.css` and `figma.css`. The new `src/routes/blueprint/+layout.svelte` imports only Blueprint styles and interactions.
  - The root layout now only renders children.
  - The chooser page has its own `src/lib/chooser.css` and opens each edition with a full page load.
- `src/hooks.server.ts` and `scripts/write-route-index.mjs` read each edition's own page list.
- **Guard:** `scripts/figma-freeze.mjs` and its manifest `scripts/figma-freeze.json` (190 files) are part of `npm run check`.

Figma-edition source files (`src/lib/pages`, `src/lib/components`, `src/lib/site.ts`, `src/lib/interactions.js`, `src/shared.css`, `src/figma.css`, `src/assets`) were not edited. Their Blueprint branches remain as unused code.

## Verification

Both editions were captured before and after the change. That covers all 13 pages at 1440×900 and 375×812, with reduced motion. Each capture has two parts:

- **DOM:** the normalized document, with scripts, stylesheet links, Svelte hydration comments and inter-tag whitespace removed.
- **Fingerprint:** for every element, its rounded box and hashes of its full sorted computed style, including `::before` and `::after`.

Two consecutive baseline captures matched exactly on all 52 pages. That confirms the method is deterministic.

| Edition | DOM | Layout and computed style |
| --- | --- | --- |
| Figma (26 captures) | identical | identical |
| Blueprint (26 captures) | identical | identical, except one paragraph on three room pages |

The Blueprint exception is in the "2 Rooms cards" description. Its width changed by 0.016px because the text is now one text node instead of three. It is not visible.

The built CSS for `/figma/` contains no Blueprint stylesheet. Its one Blueprint-scoped rule comes from the unchanged `src/shared.css`. The built CSS for `/blueprint/` contains no Figma rules.

In-browser checks:
- Chooser → Blueprint loads only the Blueprint CSS.
- Blueprint mobile menu, client navigation to The Villas and gallery open/close work.
- Figma language toast and client navigation work, with only the Figma CSS loaded.

`npm run build` and `npm run check` pass: svelte-check reports 0 errors and 0 warnings, 26 routes pass, and 190 frozen files are verified.
