# Local QA — 2026-11-02

Final delivery uses SvelteKit 3.1.1, Svelte 5.57.3 and adapter-static 4.0.1. Both editions are native Svelte components. React/ReactDOM are absent from the source dependency graph and production build.

## Verified

- Production prerender:26 edition pages plus the chooser. `npm run build` and `npm run check` pass; svelte-check reports0 errors/0 warnings.
- Browser matrix: all26 routes ×360/375/768/1024/1440px,130 cases. OneH1 per page; no horizontal overflow of headings/prose/controls/shell, no broken loaded images. Evidence: `outputs/qa/svelte-responsive-matrix.json` (ignored).
- Earlier full-page visual scroll review of all26 layouts led to shared fixes: card aspect reservation, complete desktop card rows, quote display scale/attribution/artwork, newsletter placement and scale, footer mobile wrapping, header dropdown containing block and hover/click interaction. The migration preserved these styles; final desktop/mobile screenshots are in `outputs/qa/svelte-*-desktop.png` / `svelte-*-mobile.png`.
- Independent source-versus-Svelte SSR audit: all13 pages in both editions retain text, bracket placeholders, media, links, headings and section order. All178 vector typography blocks preserve inter-word spaces; Home H1 has14 words/13 spaces, Blueprint700/Figma400.
- Live SvelteKit navigation through the mobile menu updates URL, title, content, header theme and body metadata, closing the old overlay. Mobile menu opens and closes; Esc returns focus after its closing animation.
- Gallery opens by photo/keyboard or its CTA after client navigation, shows the supplied photograph, closes withEsc and restores focus. Every supplied gallery has only one photo, so next/previous arrows and thumbnails are hidden; multi-photo swipe/arrow handling exists but a real multi-photo source was not supplied and was not claimed as a tested multi-slide journey.
- Newsletter has native email validation and a Svelte submit handler. A seeded local QA address produces the truthful unconnected status; no subscription, email storage or network submission is performed.
- All local href/src references in prerenderedHTML resolve. Static checker rejects missing routes/assets, unexpanded intake markers, invalid values and missing shells.
- New Svelte browser checks produced no new console errors. Old logs from the preliminary cross-document transition experiment were excluded from this final-build result. Reduced-motion styles and runtime checks remain present.

## Limits

This is local design review, not a production integration certification. No automated pixel baseline, screen-reader/axe certification or measured Core Web Vitals claim. The supplied ready frames are1440px desktop only; mobile is a responsive implementation. Missing rates, destinations, dates, translations and integrations remain as documented in `placeholders.md`.

Package audit after selecting current patched build tools reports no high/moderate findings and4 low transitive build-tool findings around deepmerge; no force/downgrade override was introduced. This is recorded separately from browser behavior.

No commit, push or public deployment has been requested for this new project. Existing websites were not edited.

## Subsequent full audit

The expanded audit and fixes supersede the original 130-case snapshot above. See [deep-audit-2026-11-02.md](deep-audit-2026-11-02.md) for the final 780-case responsive matrix, 52 axe runs and expanded menu/gallery/navigation checks. Automated axe checks are now present; physical-device, screen-reader and field-performance certification remain outside the verified scope.
