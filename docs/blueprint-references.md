# Blueprint references: what they do and what The Vessyl takes

Written on 2026-11-03. The owner supplied two references on 2026-11-02 and asked for a beautiful design that uses what suits the brand. Until now neither had been studied: each was opened for about a minute. This is the study.

Method:
- Shopify Editions was scrolled with the wheel at 1440 × 900 and captured every 540 px, 90 frames over 54,000 px. Its structure, fonts and pointer response were probed in headless Chrome.
- On motionsites.ai, 21 entries that could suit a hotel in nature were played and captured frame by frame.

## Shopify Editions, Winter '26: "The Renaissance Edition"

https://www.shopify.com/editions/winter2026

**1. One art direction carries the whole page.**
- Every chapter is a Renaissance painting, remade with today's objects: a pink shopping bag, a skateboard, a phone held by a painted hand, a beanie on a Botticelli face.
- Twelve chapters, twelve paintings, one idea. Nothing is a stock picture or a screenshot in a box.
- The concept is the design. The layout only stages it.

**2. A stage and sheets.**
- A full-screen WebGL canvas, 1440 × 900, stays fixed behind the page and shows the current chapter's painting.
- Content arrives as sheets of greige paper that slide up over the stage. Each sheet has a torn top edge, so the painting shows through the tear.
- At the next chapter the sheet ends, the painting returns, and the next one takes its place.
- The reader is always either inside a picture or reading on paper, never on an empty background.

**3. The chapter opener is a typographic event.**
- The chapter name ("Sidekick", "Agentic", "Online", "Retail", "Marketing", "Checkout") is set in bold Neue Montreal at about 160–200 px, close to a fifth of the screen height.
- It rises across the painting at its own speed, slower than the page: it enters at the bottom and leaves at the top while the painting holds still.
- A one-line subtitle follows in a light serif. Its first letter is a calligraphic swash capital in another face (HWCigars).
- The pairing is two clearly different voices: a heavy modern sans for names, an elegant serif with swashes for sentences.

**4. Depth that answers the pointer.**
- The opening painting is built in layers: flowers in front, the two figures, the trees, the sky.
- Moving the pointer shifts the layers at different rates. Between two pointer positions about 15–20 % of the screen's pixels change.
- Nothing moves when the pointer is still, so the scene stays calm and responds when you do.

**5. Paintings change state.**
- Within a chapter the painting turns into a line drawing: white engraving strokes on black, as if the painting were being sketched back.
- The photograph becomes a drawing of itself. It is a transition with meaning, not a fade.

**6. Collage instead of a grid.**
- In the sheets, product screens float at different depths beside real objects cut out of the painting world: a skateboard, a wheel, a catalogue, a phone in a painted hand.
- Things overlap, sit slightly rotated and cast soft shadows.
- A field of command names (/brand-image, /seo-optimization) is joined by thin lines into a constellation. It is a list, made worth looking at.

**7. Rhythm.**
- Immersive and dark chapter openers alternate with calm, dense reading sheets.
- The dense parts are dense: two-column feature lists in small type.
- Calm comes from the alternation, not from empty space.

**8. A fixed index.**
- On the left, a small index of the twelve chapters numbered I–XII stays in view and marks the current one.
- On a single long page with twelve real chapters the numbers are an index. On our eighteen separate pages they would be the counter the owner rejected, so we do not take this.

## motionsites.ai

https://motionsites.ai/

**What it is.**
- A catalogue of prompts for AI-generated landing heroes, each with a looping preview.
- Most entries share one look: a dark background, a bold sans headline, a glossy 3D object or character. That is the generic look we have to avoid.
- Its value for us is a handful of mechanisms, not its style.

**Mechanisms worth taking:**
- **Subject in front of the word** (Jellyfish Scroll, Nature Ritual, Urban Jungle). A huge word sits behind a cut-out subject, so the picture overlaps its own title, and the word sits in the picture's depth rather than on top of it.
- **The pointer moves the light** (Halo Prism). A beam follows the pointer and the scene reacts. For us this is a pointer that parts the mist, or moves the light inside the Dome.
- **Reveal under the pointer** (Ink Reveal, Hover Ink). Colour or an image blooms where the pointer passes. For us: water or steam, not ink.
- **Window into a scene** (Halvøy Nordic Cabin, Space Voyage). A framed opening in the page shows a world beyond, and scrolling carries you through it.
- **Endless gallery** (Infinite Gallery). A field of pictures you drag in any direction, for the galleries.

**Left out:**
- glossy 3D characters and objects;
- neon gradients;
- particle heads;
- dark tech backgrounds as a default.

None of it belongs to a hotel in a rainforest.

## What The Vessyl takes

**Kept, because the brand already asks for it:**
- **One art direction across the whole site.** Our equivalent of the remade paintings is the brand's own tension "Ancient / Futuristic" and "Wild / Exquisite": the volcano and the forest against the copper-scaled projection Dome. Every chapter is a place on the land, filmed or photographed, never a picture in a box at first.
- **The stage and the sheets.** Each chapter of a page plays on a full-screen stage of its place. Words and details arrive on sheets that slide over it. Our sheet edge is the Dome's arch, already the brand's shape, instead of a torn edge.
- **The chapter opener as a typographic event.** The place name is set at monumental scale and rises across the stage at its own speed. Our pairing follows the brand's own posters:
  - EB Garamond, the antiqua, at display scale for names;
  - EB Garamond italic with swash capitals for the sentences;
  - Roboto Light in spaced capitals for small captions.
- **Depth that answers the pointer.** The opening scene is built from layers of the brand's photographs, and the pointer moves them at different rates. Still when you are still.
- **A state change with meaning.** The brand's only transition is fog. Between chapters the stage dissolves into mist and the next place surfaces. Where Shopify turns a painting into a drawing, we turn day into night and air into steam.
- **Collage in the reading sheets.** Photographs, cut-out objects and details overlap at different depths: a copper scale, a tuning fork, a horse's head, a plate. This replaces the even grids.
- **Rhythm.** Immersive chapter openers alternate with dense, calm reading sheets. Calm comes from the alternation, not from empty ground.

**Taken from motionsites:**
- the subject in front of its word, for chapter openers;
- the pointer parting the mist;
- the window into a scene;
- the endless gallery.

**Not taken:**
- the joke of anachronism, such as the pink bag in a painting;
- bold grotesk names;
- the numbered chapter index;
- torn paper;
- 3D characters, neon, particles.

## What this needs

- **Cut-outs.** The subject-in-front and layered-depth effects need the subject separated from its background: the Dome, a horse, a figure in the pool, plants for the foreground. They can be made from the 45 MP masters. A few are possible by hand for the concept. A full set needs a segmentation tool, and the owner's choice of which one.
- **Grain and materials.** A fine grain over the stage, plus copper, stone and water textures from the brand's own close-ups. These are already in the photographs (scales, tiles, boulders).

## The concept, 2026-11-03

A working prototype of the home page in this direction was built outside the site, to be judged before any change to it. It lives in the raw bank at `marketing-site/brand-everything/2026-11-02/blueprint-preview/2026-11-03-concept/`, with key frames, a phone board and a 38-second walkthrough recorded in Chrome.

**What it shows:**
- **Arrival.** The pool and Arenal fill a fixed stage. "ARENAL" is set in Roman capitals at about a fifth of the screen width, behind the volcano, the treeline and the swimmer, so the land stands in front of its own name. The pointer moves the sky, the word and the land at three rates. The invitation "Just come curious. The rest is between you and The Vessyl." arrives on the first sheet, in swash italic, with the booking actions.
- **The land.** A reading sheet in paper with a display heading and four equal pictures.
- **The Dome.** As the sheet ends, the stage turns to the Dome in its garden. "SOUND" stands behind the Dome and rises as the page moves. The next sheet is night: "Sound you stand inside.", the equipment credits as a quiet table, and the ceiling in a circle whose light follows the pointer like a projector.
- **Night.** The Dome under the Milky Way, with mist the pointer parts.
- **The next page.** A window in the Dome's arch opens onto the main house and pool from the air, with the name and its arrow.
- **Between places:** fog. The stage dissolves into mist and the next place surfaces.
- **Over everything:** a fine film grain.

**What is rough in the prototype:**
- The cut-outs were made by scanning each column for the sky, so leaf edges are coarse. Production needs proper segmentation of the 45 MP masters, or cut-outs from the designer.
- The night scene uses the 1080p loop's poster, which is soft at full screen. A sharper night photograph or the 4K master is needed.
- Only the home page and these four places are drawn. The experiences rail, stays, voices and footer are not in it yet.
