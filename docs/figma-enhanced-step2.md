# Figma Enhanced — step 2, signature features

Each feature is studied before it is built, then reviewed by the owner before the next one starts (`docs/figma-enhanced-plan.md`, step 2).

## 2.1 Header and mega menu (2026-11-08)

### What the references do

**`/blueprint/` header, commit 452c7d0** (owner's reference 1). Code: `src/lib/blueprint/components/Header.svelte`, `styles/base.css` 46–72, `motion.ts` 175–190.
- Layout: Menu with a two-line icon on the left, the logo in the middle, EN/ES and a copper "Check availability" pill on the right.
- The header is fixed and floats over the page with no background.
- It takes the colour of the section under it: light text over forest, petrol and night sections, ink over paper. The section is read at 36px from the top.
- After 40px of scrolling it gets a solid background (paper or night) with a hairline under it.
- Past 320px, while you scroll down, it slides up out of view (`translateY(-101%)`). Any scroll up brings it back. It never hides while the menu is open.
- A copper reading-progress line, 1px high, runs along its bottom edge and grows with the page.
- On phones the Menu label and the booking button are hidden.

**Legacy Blueprint "The Experience" mega menu** (owner's reference 10). Code in `vessyl-website-blueprint`: `app/components/SiteNavigation.tsx` 120–235, `app/globals.css` 2996–3045, `app/motion.css` 46–80, `app/blueprint-cinematic.css` 62–85.
- A trigger with a chevron sits in the header's navigation.
- It opens a full-width panel under the header: four photo cards (4:3, rounded) with a label under each, and "Overview ↗" in a narrow last column.
- The panel is frosted glass in the site's dark brown.
- It enters with a fade and a 10px drop (300 and 440ms) and leaves faster.
- Hovering a card enlarges its photo by 6% and underlines the label. Hovering "Overview" enlarges it.
- Keyboard and pointer:
  - Arrow Down or Tab on the trigger opens the panel and moves focus into it.
  - Escape closes it and returns focus to the trigger.
  - A click or focus outside closes it.
  - Shift+Tab from the first card goes back to the trigger.
  - Tab from "Overview" closes the panel and moves on.
- Phones get an accordion inside the menu dialog instead.

### What we take, what stays, what we leave

**Taken from `/blueprint/`:**
- the fixed header that takes the light of the section under it;
- the background after 40px;
- hiding while reading down and returning on the way up;
- the copper progress line.

**What stays the designer's:**
- the header's own layout and elements (MENU, centred logo, EN | ES, "Check availability");
- its two colourings: copper on light sections, light on photographs and dark sections.

**Taken from Legacy:**
- the mega menu: its panel, cards, motion and keyboard behaviour;
- two triggers, Where you sleep and Experiences, beside MENU on wide screens;
- each panel ends with "Overview ↗" to the overview page (02 or 07).

**Left out:**
- Legacy's glass pill around the navigation: the designer's header has no pill.
- The language popover: the designer's EN | ES stays.
- Mobile accordion: the designer's full menu already lists every page.

### Decisions

- **Which sections count as dark:** photo heroes, overlays, galleries, the map, the closing photograph and newsletter, the events newsletter, and the footer. Everything else is light. The section under the middle of the header decides.
- **Logo:** both versions, white and copper, are in the markup, so the logo changes colour without loading.
- **Background after 40px:**
  - On light sections: white at 92%, blurred, with the light rule under it.
  - On dark sections: the footer night colour at 86%, blurred.
- **The panels:**
  - **Where you sleep:** The Villas, The Treehouse, Glamping Tents, Rates and offers.
  - **Experiences:** The Day and the Half Day, The Frequency Experience, Arenal After Dark, For Two, Horses and the River, The Vessyl Presents.
  - Each card shows the page's own opening photograph, 4:3 with a 10px radius, on the frames' dark brown glass.
- **Width:** the triggers show from 1180px, where they fit beside MENU without reaching the centred logo. Below that the MENU dialog does the job.
- **Reduced motion:** the header does not slide and the panels appear without moving.

### Built (2026-11-08), waiting for the owner's review

- `src/lib/enhanced/components/Header.svelte`: the designer's header with two mega triggers beside MENU, two logos, two panels and the progress line.
- `src/lib/enhanced/styles/header.css`: the floating header, its two tones, the background after 40px, stepping away, the progress line, the panels.
- `src/lib/enhanced/interactions.js`:
  - `updateHeader` reads the section under the header on every scroll frame.
  - `openMega` and `closeMegas` handle the pointer and the keys described above.
  - Any open overlay closes on navigation.
- The cards show each page's opening photograph. Two pages are exceptions:
  - Glamping Tents shares the Villas' opener, so its card shows a tent.
  - Rates and offers opens on text, so its card shows its first photograph.
- Checked:
  - in Chrome, WebKit and Firefox: hides on the way down, returns on the way up, light and dark tones, panels open and close by click, Arrow Down, Escape and a click outside;
  - layout at 69 widths in three engines;
  - axe on 28 pages at three widths;
  - gallery, menu and newsletter tests.

## 2.2 Smooth scrolling and page transitions (2026-11-08)

### What the references do

**Lenis on `/blueprint/`, commit 452c7d0.** Code: `src/lib/blueprint/motion.ts` 25–33, `src/routes/blueprint/+layout.svelte` 49–58.
- Wheel scrolling is smoothed with `lerp: 0.09` and `wheelMultiplier: 0.9`. Touch stays native. The page keeps its inertia: text and photographs glide to a stop instead of stepping.
- It is not started when the visitor prefers reduced motion.
- Scrolling stops while the menu or the photo viewer is open, and starts again when they close.
- After every page change Lenis is resized and moved to the browser's position at once, so it never scrolls the new page back to where the old one was.

**Legacy Blueprint page transitions** (owner's reference 11, commit 437572a). Code in `vessyl-website-blueprint`: `app/page-transitions.css`, `public/page-transitions.js`, `app/motion.css` 1–40.
- The whole page dissolves: the old one fades out in 450ms, the new one fades in over 600ms (`cubic-bezier(0.4, 0, 0.2, 1)`).
- When the departing page's opening photograph is still on screen, the photographs travel together:
  - The old one stays fully visible while the new one dissolves over it in 800ms.
  - Inside the new frame the photograph settles from 110% to 100% scale over the same 800ms. This is "the hero arriving smoothly".
- The hero text leaves in 120ms. The new text arrives 240ms later, rising 7px and fading in over 400ms.
- The header, when visible, cross-fades in 750ms instead of blinking.
- Menus and dropdowns are hidden before the old page is captured.
- With reduced motion there is no transition.

### Decisions

- Lenis with the `/blueprint/` settings, wheel only:
  - It is skipped with reduced motion.
  - It stops while the menu dialog or the photo viewer is open.
  - It is synced after every navigation.
  - The mega panels and dialogs scroll on their own (`data-lenis-prevent`).
- The edition's existing View Transition gets the Legacy choreography:
  - The opening sections share a transition name when the departing one is visible.
  - The new photograph settles from 110% once its image is decoded. The wait is capped at 400ms, so a slow image never holds the page.
  - The header cross-fades when it is on screen.
  - Hero text arrives after the photograph.
- Text-hero pages take part too: their opening panel dissolves the same way, without the zoom.

### Built (2026-11-08), waiting for the owner's review

- **Lenis** (`interactions.js`):
  - Settings: `lerp 0.09`, `wheelMultiplier 0.9`, wheel only. Not started with reduced motion.
  - It stops while the menu or the photo viewer is open.
  - The menu, the viewer and the mega panels scroll on their own (`data-lenis-prevent`).
  - `lenis/dist/lenis.css` is imported by the layout.
- **Navigation** (`src/routes/figma-enhanced/+layout.svelte`):
  - A glide still running stops when any navigation starts, so Back right after a wheel does not carry the old page's glide over.
  - After the page changes, Lenis is resized and moved to the position SvelteKit chose. Back and Forward restore positions exactly.
- **Transition** (`+layout.svelte`, `styles/motion.css`):
  - The page dissolves (450 / 600ms).
  - When the departing opening is on screen, the openings share a name: the old one stays while the new one dissolves over 800ms.
  - The new photograph settles from 110% to 100% in 800ms. The new page waits for it to decode, at most 400ms.
  - The hero text leaves in 120ms, and the new text rises 7px and fades in over 400ms after 240ms.
  - The visible header cross-fades in 750ms.
  - Mega panels are never captured.
- **Checked:**
  - In Chrome, WebKit and Firefox:
    - one wheel step glides about 330px over half a second;
    - scrolling stops while the menu is open;
    - the transition timings above, measured from the running animations;
    - the new page opens at the top;
    - Back and Forward restore 0 and 809px.
  - With reduced motion there is no Lenis and no transition.
  - Layout at 69 widths in three engines, axe, and the gallery, menu and newsletter tests.

## 2.3 Films (2026-11-08)

### What the references do

**Legacy Blueprint films** (owner's reference 12). Code in `vessyl-website-blueprint`: `app/components/EditorialFilm.tsx`, `lib/films.ts`.
- Every film starts as a silent loop, playing only while at least 15% of it is on screen and the tab is visible. It pauses with reduced motion.
- A click anywhere on the film restarts it from the beginning, with sound, and stops the looping.
- After that, two small controls appear, pause/play and mute/unmute, and the film no longer resumes by itself.

**`/blueprint/` home opening, commit 452c7d0** (owner's reference 2). Code: `src/lib/blueprint/blocks/Hero.svelte`, `styles/blocks.css` 15–35, `motion.ts` 195–205; the clip is `public/bp/video/loop-pool.mp4`.
- Layout: a large EB Garamond title and actions on the left; on the right a looping film inside an arch the shape of the Dome. The arch starts under the header, and its top is a half circle.
- The block is 185svh tall and its stage is sticky. As you scroll, the arch's clip opens until the film fills the screen:
  - inset and radius go to zero;
  - the film slides so the subject that sat in the arch's middle ends centred;
  - it settles from 112% to 100%.
- The copy fades, rises and blurs away as the arch opens, so nothing is written over the open film. The header turns light past 55%.
- On screens narrower than 900px the arch does not open: the copy stands above a 76svh arch.

**The footage.** `public/bp/video` holds loops and films cut by `scripts/blueprint-media/*.sh`. They come only from the brand's approved footage:
- the VESSYL hero film;
- the property overview reel;
- the programming and events reels;
- for the villas, the rates and the main house, a slow "breathing" camera move over an approved photograph.

The scripts state that nothing about a place is invented.

### Decisions

- **Home opening:** the `/blueprint/` arch with `loop-pool`, as in the owner's reference.
  - It is a fragment of the brand film, so the "Watch the film" control plays that film, `film-vessyl.mp4` (61s, with sound), from the start. Legacy behaviour.
  - The designer's title and actions stay as they are and move to the left of the arch.
  - The night photograph of the Dome remains the page's closing photograph.
- **Silent loops in the openings**, where the brand footage shows the same subject as the designer's photograph:
  - The Treehouse: `loop-treehouse`, the treehouse from the air.
  - Glamping Tents: `loop-tents`. The tents from the air, which also ends the reuse of the Villas photograph.
  - For Two: `loop-evening`, the same table for two at sunset.
  - Horses and the River: `loop-river`.
  - The Harmonic Hearth: `loop-hearth`, the same room.
  - Horses and the Land: `loop-pasture`, horses on the same track.
  - The Recording Studio: `loop-studio`, the console.
  - Take the Whole Property: `loop-house`, the property from the air.
- **Openings that keep their photograph:** the footage shows a different subject or time of day (the Villas interior, the Dome by day, the day pool).
- **Loop behaviour:**
  - Loops have no sound, so they stay silent.
  - They play only while on screen and visible, and not with reduced motion; the poster stands in.
  - Phones get the 1280px cut where one exists.
- **Text on photographs:** checked again on the loops' frames, since the picture changed.

### Built (2026-11-08), waiting for the owner's review

- **Home** (`pages/P01.svelte`, `styles/films.css`, `interactions.js` `setupArch`/`updateArch`):
  - The designer's title and two buttons sit left of the arch with `loop-pool`.
  - From 900px the block is 185svh and its stage sticks. The arch opens with the scroll, following it with a short lag. The copy fades, rises and blurs away. The header turns light past 55%.
  - Below 900px, and with reduced motion, the copy stands above an arch that does not open.
  - The page's header starts copper (`photo: false` for page 01).
- **The film** (`playFilm`, `filmControls`):
  - "Watch the film" on frosted glass, inside the arch's corner, swaps the loop for `film-vessyl.mp4` and plays it from the start with sound.
  - Pause/play and sound on/off controls take its place, and focus moves to them.
  - After that the film plays only on the visitor's taps, and pauses when scrolled away.
- **Silent loops** in eight openings (`pages/P04, P05, P11, P12, P15, P17, P18, P22`):
  - Each covers the designer's photograph, which stays as the fallback. Phones get the 1280px cut where one exists.
  - They play only while 15% or more is on screen in a visible tab, and not with reduced motion.
  - The openings' alt texts now describe what the loops show (tents from the air, a rider in the river, steam over the Hearth's stones, the studio console).
- **Text on the loops**, checked by eye at 1440 and 375:
  - Glamping Tents moves to frosted glass (tents from the air).
  - For Two and The Harmonic Hearth keep their text on calm parts.
  - The other loop pages were already on glass.
- **Publishing:** `scripts/build-pages.mjs` copies into the enhanced artifact only the `bp/video` files its pages name: 26 files, 59 MB.
- **Checked:**
  - In Chrome, WebKit and Firefox: the arch opens and the header turns; the film plays with sound from the start; the loops play.
  - With reduced motion the arch stays closed and the loops show their posters.
  - Layout at 69 widths in three engines, axe, and the gallery, menu and newsletter tests.
