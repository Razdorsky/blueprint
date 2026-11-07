# Figma Enhanced — work plan (2026-11-07)

The owner's decision, 2026-11-07:
- https://razdorsky.github.io/figma/ stays frozen. It changes only when the designer supplies something new.
- The improved Figma edition lives at its own address. The owner proposed `/figma-ehanced/`; the spelling is to be confirmed (see Step 0.1).
- Work order: first a basic design-system foundation, then the signature features.

Inputs:
- `docs/figma-design-audit.md`: the audit numbers, the "what to change / what to add" lists, the owner's 20 liked references and the rejections.
- Owner memory: liked elements and rejections.

Every step below is reviewed by the owner before the next one starts. Every step is committed on its own. Nothing is published without the owner's request.

## Rules for every step

- **`/figma/` is not touched.** The freeze manifest (`scripts/figma-freeze.mjs`) must keep passing. The enhanced edition has its own pages, components and styles; it imports nothing from `src/lib/pages`, `src/lib/components`, `src/figma.css` or `src/lib/interactions.js`. The Blueprint edition is not touched either.
- **Designer updates** land in `/figma/` first, exactly as before. Then they are ported to the enhanced edition, adapted to its system.
- **Content stays the designer's:** the same 28 pages, texts, facts, placeholders and corrected typos. Headings use EB Garamond and text uses Roboto, with all text properties from the frames, as in `/figma/` today. Text selection and copying stay blocked.
- **The owner's rejections apply** (memory `site-design-rejections`):
  - no number labels, eyebrow clutter or technical hairlines;
  - no text over detailed photographs;
  - no gradient stripes between flat colour blocks (a photo melting into a matching footer is fine);
  - one photo shape per group;
  - no generated fake versions of real places;
  - every change must be seen while its picture fills the screen.
- **QA per step:**
  - layout at 69 widths (360–2560) in Chrome, WebKit and Firefox (WebKit and Firefox through a second server, because port 4190 is blocked);
  - axe at 1440, 768 and 375;
  - `prefers-reduced-motion` respected;
  - no console errors;
  - the text-property check against the frames;
  - `npm run check`;
  - `npm run build:pages` on a clean copy of the commit;
  - the owner reviews screenshots at their window width (about 2000 CSS px) and on a phone.

## Step 0 — The new address and a baseline

0.1 **Name confirmed: `figma-enhanced`** (owner, 2026-11-07). Decisions taken by default, for the owner to overrule: EB Garamond headings, Roboto text and the copy block carry over, and the edition is English only for now.

0.2 **Done 2026-11-07.** Added the edition to the repository as `src/routes/figma-enhanced/` and `src/lib/enhanced/`:
- It starts as an exact copy of the Figma edition: pages P01–P28, components, styles and interactions.
- `hooks.server.ts`, the chooser page, `build-pages.mjs`, `check.mjs` and the Pages workflow learn the third edition. The workflow already deploys the edition named after the repository.

0.3 **Create the GitHub repository `Razdorsky/<name>`** (public, like the others) and add a remote. This is an outward action: done only after the name is confirmed.

0.4 **First publish as a baseline.**
- The site must match `/figma/` at every width: compare screenshots of all 28 pages.
- From here on, every step is measured against this baseline.

## Step 1 — Design-system foundation

Goal: one system under all 28 pages, so that pages stop looking assembled from hand-sized templates. The audit's numbers are the before state.

**Done 2026-11-08, waiting for the owner's review (Checkpoint 1).** The system is described in `docs/figma-enhanced-system.md`, with the before and after numbers. In short:
- tokens in `tokens.css`; one page stylesheet, `system.css`, written by section role;
- three hero types: photograph, split and text;
- white, beige, forest and night bands;
- the closing night photograph melts into the footer, and the newsletter sits under it;
- 11 text styles, text on column lines, 24 labels instead of 250, three photo proportions;
- states for buttons and the newsletter;
- `alt` texts that describe the photographs.

Decisions taken during the step, for the owner to review:
- Every opener with a paragraph became a split hero (pages 03–05, 08–12, 23–25), because no paragraph may sit over a photograph.
- Fact terms are sentence-case Roboto 500 instead of tracked capitals.
- The newsletter sits under the closing photograph rather than over it, for the same reason.

1.1 **Tokens**, written in `src/lib/enhanced/styles/tokens.css` and described in `docs/figma-enhanced-system.md`:
- **Grid:** 12 columns at 1440 with fixed outer margins; the same grid at 1024, 768 and 375.
- **Spacing:** a scale of section paddings (3–4 steps) and stack gaps.
- **Type styles:** about 10, in EB Garamond and Roboto. The display scale is tuned for EB Garamond, which reads smaller than Telugu MN. H1 is clearly larger than H2. The body sizes are 18/30 and 22/32.
- **Colour roles:** ink, muted, accent (copper), surface (beige), dark surface, on-dark. Contrast is checked for every pair.
- **Radii**, the owner's liked values from the Legacy Blueprint: photos 10px, controls 12px, panels 18px.
- **Shadows and motion:** durations and easings, plus the reduced-motion rule.

1.2 **Grid and spacing pass.** Every section template snaps to the grid and takes its padding from the scale. The per-instance heights go away.
- Before: 11 text left edges, and "Hero text only" in 23 heights.
- Target: text on grid columns only; section heights from content.

1.3 **Hierarchy pass.**
- H1 is larger than H2. Eyebrows stay only where they carry meaning, fewer than 3 a page (today about 9).
- Body styles are unified: no more 18/30 against 18/24 by accident.

1.4 **Components and states.**
- **Buttons:** primary, the Legacy translucent gradient button on photos, and a text link with arrow.
- **Cards** and **photo frames:** one shape per group, three aspect ratios.
- **States:** hover, focus, pressed, disabled; newsletter error and success.
- **Clean-up:** remove the "Button" placeholders, the empty "+" topics and the gallery dots without photos. Write alt texts that describe the pictures.

1.5 **Surfaces and rhythm.**
- Light, beige and dark bands meet at clean edges. Each page opens with one of a few hero types instead of one template.
- The footer melts into the closing photo (Legacy reference 13).

1.6 **Responsive specs.** Each template gets designed layouts at 375, 768 and 1024, instead of the fallbacks we improvised for `/figma/`.

**Checkpoint 1:**
- The owner reviews all 28 pages on desktop and mobile.
- The audit metrics are measured again.
- Publish on request.

## Step 2 — Signature features

One at a time, each reviewed before the next. References are numbered as in `docs/figma-design-audit.md`.

2.1 **Header** from `/blueprint/` 452c7d0 (reference 1): floating, takes the light of the section beneath, steps away while you scroll down, with a reading-progress line. Add the Legacy mega menu (reference 10) for Where you sleep and Experiences, with an Overview link to pages 02 and 07.

2.2 **Smooth scrolling and page transitions.**
- Lenis inertia (452c7d0).
- View Transitions between pages, with the hero arriving smoothly (Legacy reference 11).

2.3 **Films.**
- Silent loops that restart with sound on click (Legacy reference 12).
- The Home opening: a film in the Dome's arch that opens to full screen as you scroll (reference 2).

2.4 **The drifting gallery** (reference 3): a sticky title, with photo cards at two depths passing it. Used once, where a page introduces the land.

2.5 **The dark arch over a full-screen photo** (reference 5): for the evening and dining moments.

2.6 **The next-page block** (reference 7), improved: the button to the next page is designed inside the opening media.

2.7 **Rethought pieces.**
- The horizontal rail (reference 4) gets a band of its own and a progress cue.
- The text-and-photo change (reference 6) gets decisive transitions: an iris or wipe in the circle, line-by-line text and a state cue.

2.8 **Photo portals and frosted glass** from the early prototype (references 15–16): arched or rounded-bottom frames with an inner border and a slow zoom-in on arrival, and frosted panels over film or 3D. No captions inside the photos.

2.9 **The artistic layer** from the "atlas" prototype (references 17–20):
- the engraving that develops into the film as you scroll, for one opening;
- margin drawings of animals and plants that draw themselves;
- engraved plates that develop into photos, with a mobile mechanic (develop at screen centre or on tap);
- fireflies over real night footage.

  No generated night versions of real places.

2.10 **The 3D Dome scene** (reference 14): a small scene, not a page. The copper Dome against Arenal, a scroll-driven camera and rings at its base, telling one thing about the Dome. Build it with a fallback still for weak devices and reduced motion.

**Checkpoint 2:**
- The owner reviews each feature as it lands.
- Performance budget: Lighthouse on Home and one inner page on desktop and mobile. Films and 3D load lazily.

## Step 3 — Content and the rest of the site

- **Photography with the owner:** replace the 24 reused photos and the mismatched card photos. No reuse across pages.
- **Pages 29–37** (When to come, About, Josh Stanley, The people here, Press, Gallery, FAQ, Contact, Rates & policies), plus 404, Privacy and Terms, when texts exist.
- **Booking:** keep the external link, or add a dates-and-guests bar — the owner decides.
- **Spanish** if wanted (Blueprint has an ES pipeline).

## Open questions for the owner before Step 0

1. The address: `figma-ehanced` or `figma-enhanced`?
2. Confirm that EB Garamond for headings, Roboto for text and the copy block carry over.
3. Languages: English only for now?
