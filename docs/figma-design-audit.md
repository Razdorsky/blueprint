# Figma edition — design-system audit and work brief (2026-11-07)

Status: **brief for later work, nothing applied.** The owner asked for an audit of the Figma edition ("the design feels unfinished, the design system could be better"). They said that no brief for the designer is needed and that we will take this into work ourselves later. Do not start until the owner says so. When they do, ask where it goes: into `/figma/`, which is frozen and changes only on the owner's request, or tried first in `/blueprint/`.

State at the time of the audit: commit 15af5dd, published at https://razdorsky.github.io/figma/. The site has 28 pages. Headings are EB Garamond and text is Roboto, by the owner's decision. Text selection and copying are blocked. Typos in the frames are already corrected (see the change register in `docs/figma-adaptation.md`).

## Diagnosis

The frames are page layouts assembled from about 15 section templates; there is no design system under them. Every instance has hand-set sizes, so pages look tidy one section at a time but not as a whole. All numbers below were measured on all 28 pages at 1440px.

### What to change

1. **No common grid.**
   - Text in sections starts at 11 recurring left edges: 55, 89, 95, 100, 105, 115, 140, 164, 168, 180 and 194px. That counts edges seen four times or more; 25 others appear only once or twice.
   - Their sources:
     - Description 60/40: px-100.
     - 50/50: 541 + 67 + 496, centred, so 168.
     - 40/60: px-55.
     - included: px-115.
     - Callout: px-145.
     - Hero text only: px-180.
     - Heading title: px-194.
     - Card Grid: a centred 1262px row, so 89.
   - Target: one column grid at 1440 with fixed outer margins, which every section's text and media snap to.
2. **No spacing scale.**
   - Hero text only: 26 uses with 23 different heights, from 173 to 546px.
   - Description 60/40: 9 heights. included: 8. Callout: 8. Card Grid: 7. Heading title: 6.
   - 50/50 sections are fixed at 900px (40/60 and 60/40 at 800) whatever their content, which leaves voids (for example The Frequency Dome, "Geometry, not mysticism").
   - `src/figma.css` carries dozens of per-instance `min-height` rules only to match these frames.
   - Target: 3–4 vertical section paddings from a scale. Heights come from content.
3. **Every page has the same skeleton.**
   - 21 of 28 pages open with the same 700px photo hero: left gradient, eyebrow and H1 bottom-left.
   - Most then show the same Description 60/40 with a beige rate card on the right.
   - Backgrounds are white almost everywhere. The only dark bands are the newsletter and the footer (#311500, #262626); beige appears in 6 sections.
   - The text-hero pages (02, 06, 07, 13, 16, 27) open on a small heading on white, a weak first screen.
   - Target: a few hero types (full-bleed film or photo, split, text with image), alternating light, dark and beige bands, and one signature section per page.
4. **Flat type hierarchy and label noise.**
   - The page H1 and section H2 share 52/60.
   - There are 20 distinct text styles.
   - There are 250 eyebrow labels, about 9 a page: 14px SemiBold uppercase with 4.48px tracking, above nearly every heading. They read as template chrome and hurt legibility.
   - The 13 text styles in the frames are 52/60, 42/46, 36/46, 32/44.8, 28/38, 26/38, 22/32, 20/24, 18/30, 18/24, 16/20, 14/20 and 12/20; body text is both 18/30 and 18/24.
   - Target: about 10 styles, with H1 clearly larger than H2. Rebuild the display scale for EB Garamond, which reads smaller than Telugu MN at the same size because its x-height is 0.40 against 0.50. Keep labels only where they carry meaning.
5. **Colour without roles.**
   - Text uses 9 colours with near-duplicates:
     - copper #a2551b, brown #733a11 and sand #d3a079;
     - green #364830 and dark green #1a3013;
     - ink #262626 and #121310;
     - plus #f5ebe7 and #dabfb6.
   - Target: named roles: ink, muted, accent, surface (beige), dark surface, on-dark. Check every pair for contrast.
   - The OFFER ribbon, white on #d57e3d (3.05:1), is acceptable only because it is set in large bold type. A darker orange would let it use the frames' SemiBold.
6. **Photography without art direction.**
   - 106 photos are used, and 24 of them appear on several pages:
     - `38bd44acd09f7a1caa67` (pool pavilion): pages 2, 3, 4, 5, 6, 7 and 11. It is also the Treehouse hero, which does not show a treehouse.
     - `1cf43cba02fcc0f90ae8`: 2, 3, 4, 6, 7, 11.
     - `11358b370ad895b42644` (property from above): 1, 7, 22, 27, 28.
     - `9772fed083830cf825f9` (volcano over the infinity pool): 1, 21, 22, 23, 28.
     - `90e7a43ef89cdaa5b7f6`: 2, 6, 7, 11.
     - `475782777018244eff8a`: 1, 15, 18.
   - The Villas and Glamping Tents share one hero (`2b61d0b9909a48665218`).
   - On page 28 the card photos do not show their subjects:
     - Waterfalls repeats the river hero.
     - Hanging bridges shows horses.
     - Lake Arenal shows the property from above.
     - Caves shows a ginger flower.
     - La Fortuna town shows a riding arena.
     - Their `alt` repeats the card title, so it describes the wrong picture too.
   - Several frames stretch photos from about 12% up to 140% (the site uses cover instead).
   - Media use five unrelated aspect ratios: 1440×700, 541×644, 767×512, 400×400 and 180×216.
   - Target: one photo per page and section, no reuse, three aspect ratios, a real treehouse and real tent photos, and alt text that describes the picture.
7. **Visible placeholders and dead ends.**
   - Visible text holds 390 placeholders: `[x]`, `[price]`, `[rate]`…
   - 9 controls read "Button".
   - 314 controls have no destination (`data-pending-link`).
   - Galleries show one photo with six dots.
   - The "+" topics on Weddings are empty.
   - Some of this is content the owner must supply; the rest is design.

### What to add

1. **Responsive frames.** The frames exist only at 1440. Mobile and tablet were adapted by us. Needed: 375 and 768 frames, at least one per section template, and stated breakpoints.
2. **Component states.**
   - Buttons and links: hover, focus, pressed, disabled.
   - Newsletter: error and success.
   - The open menu.
   - A real multi-photo gallery and lightbox.
   - The EN | ES switch, which has no Spanish design.
3. **Missing pages.**
   - 29–37 exist only as raster placeholders on the library page: When to come, About The Vessyl, Josh Stanley, The people here, Press, Gallery, Questions people actually ask, Contact, and Rates, policies and the fine print.
   - The footer and menu already point at them. In the footer, When to visit, FAQ, Policies, The gallery and the Contact links are pending.
   - Also 404, Privacy and Terms.
4. **A booking path.**
   - Today it is one external "Check availability" button.
   - Add a dates and guests field or a sticky booking bar, one price format, and reviews and press on the room pages. Press logos ("Seen as") exist only on Home.
5. **Section variety.**
   - Full-bleed photo or film inside pages. The brand has films; the frames use none.
   - Dark and beige bands, a quote or review, and a map or plan of the property (a map exists only on page 02).
6. **Motion rules.** Reveal, page transition and card hover, sparing and consistent.
7. **The system itself.** Grid, spacing scale, type styles and colour roles, written as tokens. This is the root fix. Items 1–4 of "What to change" follow from it.

## Proposed order of work

1. **Tokens.** Define the grid at 1440 (with 375 and 768), the spacing scale, about 10 text styles for EB Garamond and Roboto, and the colour roles. Write them down before touching pages.
2. **Grid and spacing pass.** Snap all section templates to the grid and replace per-instance heights with spacing tokens.
   - Acceptance: at 1440, section text starts on grid columns only, as the left-edge inventory shows.
   - No per-instance `min-height` rules remain.
3. **Hierarchy pass.**
   - H1 larger than H2.
   - Eyebrows cut to the ones that carry meaning; target fewer than 3 a page.
   - Body styles unified.
4. **Clean-up.** Remove "Button" placeholders, the empty "+" topics and the gallery dots without photos. Fix photo `alt` texts.
5. **Rhythm.** Add hero variants and light, dark and beige bands, and give each page one signature section.
6. **Photography.** Do this with the owner's photo bank: replace duplicates and mismatches and settle on three ratios.
7. **Additions:** states, booking bar, missing pages. Pages and texts come from the owner or the designer.

After each step, run the full QA:
- layout at 69 widths in Chrome, WebKit and Firefox (WebKit and Firefox on a second server: port 4190 is blocked);
- axe at 1440, 768 and 375;
- the text-property check against the frames;
- `npm run check`;
- `npm run build:pages -- figma` on a clean copy of the commit.

Commit and publish only on the owner's request.

## How the numbers were measured

A headless Chrome pass over all 28 routes at 1440×900 recorded:
- for every `main > section`, the leftmost visible text box, its height and its background;
- for every visible text node, its family, weight, size, line height, case, tracking and colour;
- every `main img` source, by page;
- the counts of `[...]` in visible text, of controls labelled "Button", of `[data-pending-link]` and of `[data-part="eyebrow"]`.

Repeat the same pass after each step to show the change.

## Open questions for the owner

- Where does the work go: `/figma/` (it stops being a faithful copy of the frames) or `/blueprint/` first?
- Who supplies the photos for the duplicates and mismatches, and the texts for pages 29–37 and the `[x]` values?
- Should booking stay an external link, or should the site show a dates and guests field?

## Owner's references: what they like in what we have built

Notes from the owner, collected from 2026-11-07. The list will grow. Reuse these rather than inventing new ones. All three are in the published Blueprint edition, https://razdorsky.github.io/blueprint/ (commit 452c7d0).

1. **Header.**
   - Layout: "Menu" with a two-line icon on the left, the logo in the centre, and on the right EN/ES (the current language underlined) and a copper pill "Check availability".
   - Behaviour: it floats over the page and takes the light or dark colour of the section beneath. It gains a background after 40px of scrolling, steps away while you scroll down and returns when you scroll up. A copper reading-progress line runs along its foot.
   - Code: `src/lib/blueprint/components/Header.svelte`, `styles/base.css` (`.site-header`, `.header-*`, `.language`, `.progress`), `motion.ts` (theme, `scrolled`, `away`, progress, around lines 156–188).
2. **Home opening: the film that opens from an arch.**
   - A large EB Garamond heading and lede sit on the left. On the right a looping film (`pool`) plays inside an arch, the Dome's shape.
   - Scrolling opens the arch until the film fills the screen. The block is sticky inside 185svh; `clip-path` and `--open` are driven by GSAP ScrollTrigger (scrub 0.6), and the header turns dark past 55%.
   - On phones the arch does not open.
   - Code: `blocks/Hero.svelte`, `styles/blocks.css` (`.hero*`), `motion.ts` (around 195–205). The current tree's home is the WebGL stage and the hero styles have changed, so take this one from 452c7d0.
3. **The drifting gallery (`land` block, directly after the opening).**
   - A sticky centred title ("A hotel built around a dome made for sound") and lede.
   - Six 4:5 photo cards in two outer columns drift past it at two depths (1.2 and 0.8, ±35% of the screen height). The owner: "you feel the motion and the inertia, and the text flies between the photo cards".
   - Lenis smooth scrolling (lerp 0.09) gives the inertia. Captions link to their pages, and the photos reveal through a mask.
   - Code: `blocks/Land.svelte`, **removed from the current tree**, so restore it from 452c7d0. Also `styles/blocks.css` (`.land*`), `motion.ts` (around 250–258) and the Lenis setup (around 27–32).
4. **The horizontal rail (`doors` block with `rail: true`, "You do not have to stay here to come here").**
   - On wide screens the block pins, and vertical scrolling walks a row of cards sideways (GSAP ScrollTrigger pin, scrub 0.5). The first panel is the introduction with its button.
   - On phones it is a swipeable row with scroll snapping.
   - **Owner's caveat:** an interesting idea, but it lacks a treatment of its own and looks like every other block (same paper ground, same cards). Keep it as an idea to rethink and improve, not to copy as it is. Possible directions, to discuss: its own band (dark or forest tone), a progress or count indicator, larger or varied cards.
   - Code: `blocks/Doors.svelte` (still in the current tree), `styles/blocks.css` (`.doors.rail*`), `motion.ts` at 452c7d0 (around 268–275). Check how the current tree drives the rail before reusing it.
5. **The dark arch over a full-screen photograph (`nightfall` block; on Home, "You find out what is for dinner when you sit down").**
   - A dusk photograph holds the screen (sticky). Scrolling on, a dark panel in the Dome's arch shape rises softly from below and widens to the screen's edges, covering the photograph. Light meets dark at the arch's edge, never in a gradient.
   - The owner: "the big photo starts to be covered by the next block, which floats up from below with soft motion — really good".
   - Inside the panel: a large centred heading, then a 4:5 photo and text on the 12-column grid. The header turns dark.
   - Mechanics:
     - the panel overlaps the photo (`margin-top: -30svh`);
     - its shape is `clip-path: inset(… round …)` driven by `--g` from 0 to 1 (side insets 19vw → 0, radius 31vw → 0);
     - GSAP ScrollTrigger runs from "top bottom" to "top 10%", scrub 0.6.
   - Code: `blocks/Nightfall.svelte` (still in the current tree, used on one page), `styles/blocks.css` (`.nightfall*`, around 315–328), `motion.ts` (around 221–224). On Home at 452c7d0 the photograph is `dinner-two`.
6. **Text and photo that change together as you scroll (`projection` block; on Home "Sound you stand inside", the Dome's ceiling in a circle).**
   - The block pins for 60% of a screen per state. At each progress threshold the paragraph on the left and the shot in the circle on the right change together, while the circle slowly comes closer (scale 1 → 1.1).
   - **Owner's caveat:** a great approach, but under-designed. The change is hard to feel: the photo just dissolves (opacity over 1.6s), and the text swaps with no impact (opacity and a 14px shift). Nothing catches the eye, so there is no clear moment of change. Rework the transitions; do not copy it as it is.
   - Directions to discuss:
     - a decisive transition inside the circle (an iris or radial wipe, or a turn of the dome);
     - text that reveals line by line through a mask;
     - a visible state counter or ticks (1 / 3);
     - snapping to each state, so every change has its own beat.
   - Code: `blocks/Projection.svelte` (still in the current tree; used on Home and for "Geometry, not mysticism"), `styles/blocks.css` (`.projection*`, around 332–352), `motion.ts` (around 230–247).
7. **The next-page block at the end of every page, before the newsletter (`components/Next.svelte`; from Home it leads to "Where you sleep").**
   - The block shows:
     - the next page's name, large, with a round copper arrow;
     - one line about that page on the right;
     - below, that page's own opening photo or film, large.
   - Scrolling opens the media smoothly from an arch: `--g` goes 0 → 1, ScrollTrigger from "top bottom" to "center 62%", scrub 0.6. The click then continues the same movement as the next page's opening.
   - The owner: "a very pleasant block… it appears in a very interesting way… very smoothly".
   - **What it lacks (owner):** the button that leads to the next page should be designed inside the photo or film, not as the arrow beside the title above it. Then the block is finished.
   - Code: `components/Next.svelte` (in the current tree, slightly changed), `styles/blocks.css` (`.next*`, around 239–254), `motion.ts` (around 226–229).

### From the Legacy Blueprint

Source: https://razdorsky.github.io/vessyl-website-blueprint/. The code is in `~/Documents/GitHub/vessyl-website-blueprint` (Next.js, commit f937d97).

8. **Moderate corner rounding on photos.** Not sharp, not strongly rounded: `--bp-radius-photo: 10px`, `--bp-radius-control: 12px`, `--bp-radius-panel: 18px` (`app/blueprint-tokens.css`).
9. **Translucent gradient buttons.**
   - The fill is the colour of the surface the button sits on (beige, green or copper), at 60% opacity at the bottom and 35% at the top; 75/50 on hover, animated through `@property`.
   - Code: `app/blueprint-buttons.css`.
10. **The "The Experience" mega menu.**
    - Four photo cards, each with its own hover behaviour, plus "Overview ↗" to the overview page.
    - Code: `app/components/SiteNavigation.tsx` (`.experience-mega`), `app/blueprint.css` (around 340), `app/blueprint-cinematic.css` (around 62–82), `app/blueprint-motion.css` (around 30–45 and 162).
    - The Figma edition already has overview pages for such menus: 02 Where you sleep, 07 Experiences, 19 Eating here, 22 Take the whole property and 26 Arenal.
11. **Smooth page transitions,** for example from Home to The Founder.
    - The new page's hero photo also arrives smoothly.
    - Built on View Transitions with shared `bp-hero`, `bp-hero-copy` and `bp-header`: the scene takes 800ms, the copy 400ms and the header 750ms.
    - Code: `app/page-transitions.css`, `public/page-transitions.js` and `app/components/PageMotion.tsx` (commit 437572a).
12. **Silent films.** They loop without sound; a click restarts the film from the beginning with sound. Code: `app/components/EditorialFilm.tsx`.
13. **The footer melting into the photo above it** (the `closing-invitation` block, "Stay with us").
    - `--bp-footer-fade` runs from the footer colour to transparent over the photo's bottom two header-heights. The footer colour matches the photo's palette, so photo and footer flow into one another.
    - The owner: "a really beautiful transition", especially on The Founder.
    - Code: `app/blueprint.css` (lines 1–10 and 251–281), `app/globals.css` (around 808–840), `app/blueprint-cinematic.css` (`--bp-footer-gradient-reach`).
    - This does not contradict the 2026-11-03 rejection of gradient bands. That rejection was of hard gradient stripes between flat colour blocks; this is a photo dissolving into a matching solid colour.

### From the early prototype

Source: https://razdorsky.github.io/the-vessyl-prototype/. The code is in `~/Documents/Questionarie/Vessyl-Prototype` (Next.js and three.js, commit 5dc5649).

14. **The 3D Dome against the volcano.**
    - A copper-clad Dome in front of a photo of Arenal. Scrolling moves the camera to new viewpoints, and rings spread out at the Dome's base.
    - Keep it, but not as a whole page: use it as a small 3D scene that tells one interesting thing about the Dome.
    - Code: `app/components/DomeScene.tsx` (camera keyframes around 752–817, rings around 633–715, scroll binding around 847–870, backdrop `/media/arenal.webp` around 383), `domeCladding.ts`, `particleField.ts`.
15. **Geometric photo "portals".**
    - One has an arched top, the other a rounded bottom.
    - Each has a thin light border and an inner border inset by 0.7rem, a deep shadow and gradient shading.
    - They arrive by rising 2rem as they fade in, while the photo settles from a 1.3 zoom to 1 over 6s.
    - The captions inside them ("Landscape / 10.5321° N", "Natural calibration") are superfluous; drop them.
    - Code: `app/globals.css` (`.photo-portal` 1129–1215, `.reveal` 646–666), `VessylExperience.tsx` (572–620).
16. **The frosted, translucent matte-glass fill** of the Arrive / Descend / Expand / Return panel.
    - `linear-gradient(135deg, rgba(7,9,8,.56), rgba(7,9,8,.14) 78%)` with `backdrop-filter: blur(10px)`, over the 3D scene.
    - The owner likes the fill, not the numbering or the lines.
    - Code: `app/globals.css` (`.journey-path::after`, around 1030–1043).

Disliked in the same prototype: many small number labels (01, 02, 03, 04), everything numbered, and many sharp hairlines. It reads like a technical manual, not like The Vessyl.

### From the "atlas that comes alive" prototype

Source: http://localhost:4194/. The files are in the raw-source bank at `marketing-site/brand-everything/2026-11-02/blueprint-preview/2026-11-03-scenes/prototype/` (one `index.html` and `a/`). The owner does not keep this version. Take only these techniques:

17. **An engraving that comes alive into film as you scroll.** This is the first screen, and the owner singled it out.
    - The plate was engraved from the film's first frame. While the scene is pinned, scrolling develops it into the living film: a shader front follows the scroll with a lag.
    - The film waits on that same frame. Scrolling back draws the engraved lines back.
    - Code: `index.html` (shader around 142–247, arrival around 352–357, timing around 380–397), `a/arrival-plate.webp`, `a/arrival.mp4`.
18. **Small drawings appear in the margins as you scroll:** a morpho butterfly, a toucan, heliconia and monstera.
    - They draw themselves through a scroll-driven `clip-path` (`--draw`) and sit on the paper with multiply blending.
    - Code: CSS around 57–68, `.specimen`, `[data-draw]`.
19. **Engraved plates that turn into photographs on hover,** developing from the point where the pointer enters (a radial mask, `--mx/--my/--r`).
    - The owner's concern: phones have no hover, so this needs its own mobile mechanic, for example developing as the card reaches the centre of the screen, with scrolling or on tap. Today the plates never develop on phones.
    - Code: CSS around 50–55, JS around 362–366.
20. **Fireflies:** a few warm yellow lights, slow, masked over the forest. Reusable over real night footage. Code: `canvas.flies`, JS around 368–372.

Disliked in the same prototype:
- The page's composition as a whole.
- **Generated night versions of real places**, which the owner called AI slop and bad practice: in "Arenal After Dark" the day pool "turns" into a night with the Milky Way, and the Table "falls" into dusk.
- Rule: never fabricate other versions of real photographs (night, dusk, season, details). Generated stylisation that does not pretend to be reality is fine; the owner approved the engravings and the drawings of animals and plants.

### Rejected outright

- **https://razdorsky.github.io/blueprint4/** (commit 6e445a1): the Blueprint edition with the home page on a WebGL stage (the places ARENAL, film, SOUND and TABLE, a word between the subject and its background). The owner, 2026-11-07: "I do not like it at all; I would delete it outright". Do not reuse it.
- The current tree's Blueprint source is identical to 6e445a1, and the uncommitted "holding" work in `stage.ts` and `stage.css` builds on it. The liked elements above live in 452c7d0; the stage rework removed or changed them.
- **Cleanup done 2026-11-07.** Commit e4b2a20 returned the Blueprint source to 452c7d0; it is not published. The holding work is in `stash@{0}`. GitHub Pages for Razdorsky/blueprint4 was switched off. Then, on the owner's confirmation, the repository was deleted (it held only `main` = 6e445a1, which is in the local history), and the local `blueprint4` remote was removed. The prototype servers on 4194 and 4195 are stopped.
- (Before the cleanup:) Deletion was deferred by the owner until all versions had been reviewed. Then go part by part: the site and the GitHub repository (deleting the repository cannot be undone, so ask first); returning the Blueprint source to 452c7d0; dropping the uncommitted holding work.
- **The local variant http://localhost:4197/blueprint/** is blueprint4 plus the uncommitted holding work. The owner, 2026-11-07: "it contains a great many good decisions I approved, but its composition as a whole fails; I would discard this variant's commits entirely". In the cleanup after the review:
  - drop the Blueprint changes of b27a925 (the stage home, `stage.ts`, `stages.ts`, Stage, Opener, Places and Invite, `public/bp/stage`, the removed Land block);
  - drop the blueprint4 publishing of 6e445a1, together with the blueprint4 site;
  - drop the uncommitted holding work.
  
  Do not rewrite `main`, which the `figma` remote has with later commits: return the Blueprint source to 452c7d0 in a new commit and leave the Figma commits as they are. Keep the approved decisions as rules: review items 1–12 (1–11 already exist in 452c7d0) and "every change is seen". Consider keeping two technical fixes from b27a925: frame-aware image sizes (`Picture` `ratio`) and masks kept out of the alpha channel for Safari.
- **The concept prototype "the stage and the sheets"** (http://localhost:4195/, raw-source bank `blueprint-preview/2026-11-03-concept/prototype/`). The owner, 2026-11-07: "a complete failure; it can be forgotten for now". Take nothing from it. Its files stay in the bank, which the cleanup does not touch; only the local server on port 4195 stops.
