# Both Current editions — deep local audit, 2026-11-02

> The Blueprint findings below describe the edition before its rebuild later on 2026-11-02 (docs/blueprint-edition.md). The Figma findings remain current.

Scope: all 13 English pages in both `/blueprint/` and `/figma/`, native SvelteKit production build on port4180. Existing published projects were not edited. No commit, push or publication requested.

## Findings fixed in shared roles

- Blueprint header: preserve equal edge insets at561px; hide the booking action through760px before it crowds the logo/language/menu controls.
- Blueprint desktop mega menu: eliminate a leftover horizontal translation. The production CSS optimizer discarded an explicit `translate:none` reset while retaining the original `-50%` translation. Removing the unnecessary shared translation fixes the actual built output. Open-state bounds were separately tested; closed-page geometry alone did not catch this.
- Menus: sticky close row remains reachable after scrolling; modal owns scrolling and background stays fixed; Blueprint backdrop click closes it. Language/placeholder status has a live region inside the modal top layer. Minimum44px language/menu targets. Expanded-state announcement and focus restoration are synchronized.
- Menu lifecycle: cancel delayed close on route changes/reopening; dismiss old overlays/toasts on navigation; keep only one desktop dropdown open for keyboard/pointer activation; close dropdowns on outside actions. Hash/skip links are excluded from `aria-current=page`.
- Figma tablet rules: correct selector specificity, including44px Home H1,40px horizontal content padding and40px split gap at768px. The supplied desktop hierarchy is retained.
- Figma pure mobile galleries: remove the700px minimum height and resulting empty area. Pure-gallery controls now belong to the actual photo frame in both editions.
- Full-screen gallery: constrain the image box in both dimensions with `object-fit:contain`; intrinsic grid minimums previously cropped tall photographs below the viewport.
- Reserve intrinsic dimensions for70 raster image occurrences across13 native page components, using metadata from the optimized assets. This prevents gallery/photo loading from moving the CTA after scroll-to-target. The optional migration utility preserves dimensions and pure-gallery structure.
- Improve verified Home photo/press-logo alternative descriptions and add gallery dialog relationships/live counter semantics.
- Use two contrasting focus edges on light and dark control surfaces; keep gallery-image focus inside clipped photo frames.
- Blueprint light-background eyebrow text uses a darker copper for contrast; photo/dark-background roles retain the light accent.
- Page navigation: SvelteKit owns immediate scroll restoration rather than inheriting global smooth programmatic scrolling. Native page fades remain, with cancellation of superseded transitions. Normal journey tests wait for the native visual transition to finish before the next click.

Approved copy, section order, facts, source photographs and visible placeholders were preserved. External booking links consistently request a new tab with `noopener noreferrer`.

## Final checks

- `npm run build`: static prerender of26 edition routes plus chooser.
- `npm run check`:0 Svelte errors,0 warnings;26-route shell, one-H1, local asset and href checks pass.
-780 responsive geometry cases:26 routes ×28 widths, plus844×390 and1024×600 landscape on every route. Widths:360,374,375,390,414,480,560,561,600,680,681,760,761,820,821,1000,1001,1050,1051,1100,1101,1199,1200,1440,1441,1600,1920,2560. No document overflow, out-of-viewport heading/prose/control/shell, SVG word overflow or header collision/inset failures in the final run.
-52 axe-core4.14 page runs:26 pages ×375/1440px, WCAG2A/2AA/2.1AA/2.2AA tags;0 automatically detected violations. Incomplete/manual checks are retained in the evidence.
-Four additional axe checks of open mobile menu/gallery states across both editions:0 detected violations; gradient-menu contrast incomplete checks retained for manual review.
-26 mobile menu journeys: every route at375px, expanded state, focus, Esc, scroll lock and panel boundaries.
-104 open desktop dropdown cases:13 Blueprint pages ×Stay/Experiences ×1200×900,1440×900,2560×900 and1200×400. Exactly one dropdown open and no offscreen panel. Two additional844×390 long-menu tests confirm close control access, visible modal status and stationary page background.
-24 gallery journeys: six supplied galleries ×two editions ×375/1440px. Open, image bounds, Esc/focus return and safe keyboard arrows checked. Each source contains one actual photograph; next/previous controls correctly stay hidden. Real multi-photo swipe/arrow changes were not tested against invented slides.
-24 Svelte client navigations through all internal page destinations, plus returns to both Homes: URL/title/body theme/content update, exactly one H1, no lingering modal, scroll restored to top after the transition.
-Newsletter validation: empty and malformed input blocked; seeded `qa@example.com` produces the truthful unconnected-preview status in both editions. No address sent/stored and no booking/subscription transactions performed.
-New browser console errors/warnings: none in the final checked journeys.

Evidence lives in ignored `outputs/qa/deep-audit/`: matrix-and-axe.json, interactions.json, navigation.json, forms.json, final build/check logs and representative screenshots. QA fixture HTML/axe script are temporary and removed from the served build after use.

## Design-system review

Reviewer scores are qualitative, not measured accessibility or performance certification.

| Dimension | Blueprint / Figma | Evidence or boundary |
|---|---|---|
| Color consistency |9 /9|Shared page/header/control palettes; light-background label contrast corrected.|
| Typography |9 /9|Preserved semantic text/brand SVG words, tablet specificity corrected.|
| Spacing rhythm |9 /9|Shared role spacing; empty gallery height removed.|
| Component consistency |9 /9|Shared navigation, modal, gallery, newsletter and footer.|
| Responsive behavior |9 /9|780 geometry cases and separate open-overlay journeys.|
| Dark mode |N/A|Each edition uses its intentional fixed palette; no automatic second theme claimed.|
| Motion |8 /8|Smooth native page/menu transitions, reduced-motion CSS/runtime handling; no performance benchmark.|
| Accessibility |8 /8|52 axe checks and keyboard/modal journeys; manual/physical assistive-tech testing remains.|
| Information density |8 /8|Source content preserved, including intentionally unresolved placeholders.|
| Polish |9 /9|Correct loading dimensions, panel containment, focus return and gallery fit.|

## Limits and remaining source placeholders

This is a local browser/code audit. No physical iPhone/iPad/Android or independent Safari/Firefox/Edge engine runs, actual screen-reader speech pass, field Core Web Vitals measurements or external booking integration certification are claimed. Browser responsive emulation covers a finite width/height matrix, not every possible device.

No approved pixel baseline exists: formal automated visual regression remains INCONCLUSIVE. Manual visual review and concrete geometry/interaction findings are reported separately. Axe passes do not certify full WCAG compliance; source-image/outlined-text contrast and other incomplete rules require human judgment.

Source rates, capacities, calendar values, generic Button labels, unprovided destinations, untranslated locales and unconnected newsletter/booking flows remain in `placeholders.md`. They were preserved rather than fabricated or silently removed.

## User-reported line-wrap mismatch

At the source1440px width, Home introduction used an866px text track instead of the captured Figma905px track (nodeI857:15227;750:808). The width had been approximated during the initial responsive layout, so `do this.` became a sixth line. Increasing this role's desktop content measure from1220px to1259px restores905px of text after the240px artwork and114px gap, without forced line breaks or changed type size. Overflow checks did not detect this fidelity mismatch; the two source paragraphs were checked separately against the original wrap afterward. This does not constitute a pixel-baseline certification.

After the Home width correction, all30 geometry configurations and both axe widths for that page were rerun successfully and replaced in the final matrix evidence. At1440px the introduction now matches the source's exact four-line first paragraph and five-line second paragraph. Other pages and Blueprint were unaffected.
