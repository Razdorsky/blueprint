# Vessyl Current — SvelteKit

Two independent visual executions of the current 13-page Vessyl website:

- `/blueprint/` — the current content and structure, expressed through the approved Blueprint visual direction.
- `/figma/` — the current content and structure, closely following the designer's supplied frames.

This project is separate from `vessyl-website-blueprint` and `vessyl-website`.

## Local preview

```sh
npm install
npm run build
npm run check
npm run preview
```

Open http://127.0.0.1:4180/. The preview also exposes the two independent entry URLs above. Node.js22.17+ is required. The project uses SvelteKit3, Svelte5 and adapter-static. Normal builds compile the checked-in native Svelte components and assets; no Figma account, React renderer or Python intake pipeline is required.

Dependencies are installed independently in this project. The old preliminary JSX renderer is no longer a production input. Use `npm ci` for the exact locked toolchain; `npm run dev` provides the SvelteKit development server.

## Source and scope

Editable source: Figma `The Vessyl`, file `TUJWRVApGPYhc7CXhdJFNF`, completed Website2.0 page814:6489. The13frames and45shared library children are independently archived outside Git in the Vessyl raw-source bank, with original text, screenshots, exported assets and provenance. Production assets here are web presentation derivatives; original tool responses and full-frame design screenshots are excluded.

The user requests correction of clear errors and preservation of placeholders. `[rate]`, `[x]`, `[inclusion]`, schedules and similar fields remain explicit source placeholders. These are local design prototypes, not approved published prices or live availability.

The13ready source frames contain English copy only. Other locale copy is not invented. Booking actions hand off to the existing partner website; no payment or booking is performed by this project. Newsletter and footer destinations without supplied integrations remain clearly identified preview placeholders and never claim a successful subscription or store an email address.

See docs/figma-adaptation.md and docs/blueprint-adaptation.md for the separate visual contracts. Publication for this new project has not been requested.

## Implementation

`src/lib/pages/P01.svelte`–`P13.svelte` are native source components shared by the two editions. `src/lib/components/` supplies Header, Footer, Newsletter, Menu and Gallery. `src/routes/[edition]/[...slug]/` validates the edition/page and prerenders the26 known routes. SvelteKit manages client navigation, pre-rendered HTML and hydration; the root layout connects transitions and delegated controls with lifecycle cleanup. The source metadata, actual media and all supplied placeholders are retained.

The original Figma JSX was used only during the preliminary intake. It is excluded from production source and dependencies. `scripts/convert-pages-to-svelte.mjs` is an optional one-time intake utility, not part of the normal build.

See `docs/qa.md`, `docs/placeholders.md` and the two adaptation notes for verification and remaining source placeholders. No public publication was requested for this new project.

Full responsive and interaction audit: [docs/deep-audit-2026-11-02.md](docs/deep-audit-2026-11-02.md).

## Git

This project has its own local Git repository on `main`. Both editions are versioned together; original website repositories remain separate. No remote or public deployment is configured for this project.
