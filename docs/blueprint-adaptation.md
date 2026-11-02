# Blueprint visual adaptation

This edition uses the **new Figma site's 13 pages, copy, photos and placeholders**. It reuses no old Blueprint page copy or former 17-page sitemap. Original Blueprint and Classic repositories remain unchanged.

The actual visual references were read from the existing Blueprint's `app/blueprint-tokens.css`, `blueprint-typography.css`, `blueprint-buttons.css`, `blueprint.css`, `blueprint-cinematic.css`, `blueprint-photography.css`, `classic-spacing.css` and brand definitions in `globals.css`.

## Deliberate differences from the faithful Figma edition

- Cream paper surfaces, forest-pattern introductions and text heroes, copper-pattern quotations/newsletter, and a copper footer replace the largely paper-led Figma sequence.
- Photo heroes use the coherent Blueprint entrance, full-width imagery and a shared dark overlay. H1 is Bold; desktop H1/H2/H3 are 64/48/32px, tablet 52/42/30px, mobile 39/36/28px. The 28px heading/content gap is shared.
- The desktop header uses translucent capsule navigation and a matching language/control group, plus a full-width rounded dropdown. It changes to a compact mobile menu before desktop controls become squeezed.
- Ordinary actions use 12px corners, a fine border and subdued block-colour fill, rather than Figma's 4px CTA and 8px joined-button corners.
- Split sections become editorial photo/copy compositions with one spacing system. The introduction and the following photograph deliberately overlap. Photos use the established light 10px corner rounding.
- Experience cards become a two-column editorial sequence; the three accommodation types retain a useful comparison grid. Cards have open paper copy areas and fine baselines, without adding heavy glass boxes.
- Photo-overlay sections use edge-to-edge imagery and a readable atmospheric gradient instead of large opaque inner panels. Galleries sit in broad rounded frames. Amenities and comparison/event information use consistent grids and type.
- Mobile content shares 16px edges. Splits, cards, facts, newsletter and footer reflow; headings are never narrowed through artificial per-heading side padding.

## Integration hooks

Every selector is scoped to `body[data-edition='blueprint']`. The shared adapter emits `.current-page[data-page][data-index]`, semantic headings and `data-role='photo-hero|text-hero|split|overlay|cards|copy|quote|gallery|amenities|facts|introduction|callout|logos|map|comparison|events'`. Inner stable hooks include `data-part='hero-image|hero-copy|copy|media|action|actions|card|card-grid|heading|eyebrow|facts|fact|rate|artwork|event|table-scroll|gallery-controls'`. Actual CTAs are `.current-action[data-part='action']`; hero photos are figures containing the image. Description splits contain a separate rate panel; editorial splits keep source image/copy order.

Exact source `data-name` hooks refine the shared roles only where needed: `Symbol + Text`, `Overlay panel rigth`, `Price and offers`, `Seen as` and `Callout`. No CSS depends on numeric Figma node IDs.

Header/footer/newsletter use the parent's shared semantic classes. Menu visibility, keyboard behavior, page transitions, gallery interaction and form/booking destinations remain in the common runtime; no duplicate JavaScript was added here. Source placeholders stay visible and are not replaced with invented business facts.

Patterns use the unchanged approved Blueprint vector files at `/brand/patterns/direction-forest.svg` and `/brand/patterns/direction-copper.svg` supplied by the parent build. No replacement logo or decorative art is drawn in CSS.

## Validation boundary

This file records design choices and stable hooks. Final build, complete local route checks, cross-edition responsive inspection and runtime QA belong to the parent integration task. Styling should be checked at 360/375px and desktop widths after the shared adapter is available; a CSS file alone is not evidence of a passing rendered result.

## Final SvelteKit integration

The source fragments were converted into native `src/lib/pages/P01.svelte`–`P13.svelte`, with no runtime HTML injection. Shared shell components and client navigation use SvelteKit. Word-art spaces are explicit Svelte text expressions to preserve typography. Owner QA corrected inherited quote paragraph overrides, reserved card image ratios before lazy loading and kept the Presents newsletter at its source position. Blueprint desktop card groups use three columns, or two for a supplied two-card group. Native page content and placeholders are unchanged.

## Independence from the Figma edition — 2026-11-02

This edition now owns its own pages, shell, data, interactions, styles and assets under `src/lib/blueprint/` and `src/routes/blueprint/`. See [edition-separation.md](edition-separation.md). The notes above describe the state at separation. From here the edition may change layout, composition, markup and motion freely; the Figma edition is frozen.
