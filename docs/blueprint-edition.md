# Blueprint edition

The free edition of the Vessyl site, rebuilt on 2026-11-02 after a full brand study. It keeps the eighteen pages the owner approved in the Figma edition and remakes their text, layout, photography, film and motion as one story with one design system. It shares no source with the frozen Figma edition.

## Owner decisions (2026-11-02)

- **Pages.** The 18 approved pages and their meaning stay. Their text, layout, photos and animation may change.
- **Languages.** English and Latin American Spanish from the start.
- **Type.** Headings in a free antiqua, as on the brand's earlier posters. The brand dropped the posters' typeface because of its licence, and the owner plans to revise the brand book's Telugu MN.
- **Story.** "One day at The Vessyl" is a guide, not a rule.
- **Video.** Chosen by each page's meaning, and not every page has one. The home page opens with a hero video.
- **Film behaviour.** Exactly as in the legacy Blueprint `EditorialFilm`:
  - a silent loop plays while the film is on screen;
  - a tap restarts it from the beginning with sound;
  - pause and sound controls appear after the tap.
- **Treehouse.** The unit with the pitched roof on a stone trunk. The poster that calls the tent on stilts "The Sky Tree House" is wrong.
- **References.** shopify.com/editions/winter2026 and motionsites.ai, using only what suits the brand.
- **Process.** All 18 pages are built in one pass and shown together at the end.

The brand study behind these choices is outside Git, in the raw-source bank: `marketing-site/brand-everything/2026-11-02/study/` (synthesis, digests of the Brand Bible and the Visual Design book, photo and video catalogues).

## The system

**Light.** Every block declares the light it sits in:

| Tone | Colour | Role |
|---|---|---|
| paper | F5EBE7 | the brand's warm ground |
| clay | E7D8D3 | raised day surface |
| forest | 1A3013 | dusk |
| petrol | 062A33 | the Dome and night sky |
| night | 111111 | true dark |

Where the tone changes, it changes at a clean edge, carried by a full-screen picture or by the nightfall arch: the Dome's silhouette rises over the dusk photograph and widens into the night. The gradient bands of the first rebuild were removed after the owner's review of 2026-11-03 (`docs/blueprint-review.md`). The home page runs a whole day, from the morning pool to the Dome at night, and changes ground once. Its storyboard is `docs/blueprint-home.md`.

**Accent.** Copper D57E3D appears only where something is alive: the booking button, the scroll progress line, link underlines. Text on copper stays dark. Green is not used for actions.

**Type.**
- EB Garamond (variable, OFL) for headings and reading text. Its x-height is small, so reading text is 19 px on phones, 22 px at 1440 px and 24 px on wide screens, in lines of about 60–65 characters.
- Roboto for interface, facts, tables and captions.
- The sizes form one fluid scale in `styles/tokens.css`.

**Space.** Scenes are one gap apart (`--space`, 64–128 px): each pads half a gap above and below, so paddings never stack.

**Pictures.** Every picture has one shape, a rectangle rounded from one scale (`--r-lg`, `--r-md`). A group of pictures shares one proportion: 4:5 upright, 3:2 wide, 16:9 for films. It arrives once from a slightly smaller rounded mask, and pictures that open a page answer the pointer. No text is written over a detailed photograph. The header has a solid ground once the page scrolls, without frosted glass.

**The arch.** The Dome's silhouette is movement, never a picture frame. On every page the hero sits in an arch, and scrolling opens the arch until the picture fills the screen. Night arrives as an arch rising over the dusk photograph. The next-page block opens the next page's own picture from an arch the same way.

**Motion** follows the brand book. It moves at the speed of breath, starts and ends in stillness, arrives from depth rather than from the side, and uses fog as the only transition. It includes:
- **Page changes:** fog. The page dissolves into mist and the next one surfaces. The language switch only dissolves the words and keeps your place.
- **Smooth scroll:** Lenis, with scroll scenes in GSAP ScrollTrigger:
  - the hero arch opens;
  - pictures arrive once from a slightly smaller rounded mask;
  - the home page's land drifts past its title at two depths;
  - the experiences rail walks sideways;
  - films grow from inside the page to the edges of the screen;
  - night arrives as an arch rising over the dusk photograph;
  - inside the Dome, the projection drifts from one state to the next;
  - in a sequence of steps, the picture holds still and changes as each step is read;
  - the next page's picture opens from an arch.
  Text never animates word by word.
- **Opening mark:** the first visit opens with the symbol drawn from the bottom up (dome, volcano, light) above the word, as in the official small vertical logo. It plays once per visit.
- **Reduced motion:** none of this runs. Loops show their posters, and the arch stays still.

## Structure

| Path | Contents |
|---|---|
| `src/lib/blueprint/site.ts`, `site-data.json` | the 18 pages, groups, tones, routes in both languages, booking link |
| `src/lib/blueprint/content/pages.ts`, `shared.ts`, `types.ts` | every page as a list of scenes, written from its storyboard (`docs/blueprint-home.md`, `docs/blueprint-pages.md`); repeated door sets |
| `src/lib/blueprint/content/es.json` | Spanish, keyed by the English text |
| `src/lib/blueprint/blocks/` | the scenes: Hero, Land, Stay, Nightfall, Projection, Voices, Split, Doors, Facts, Steps, Gallery, Film, Table, Events, Map, Notes, Newsletter. Facts, notes, tables and events carry a picture beside their words; the statement, chapter, quote, founder and press blocks were retired on 2026-11-03 |
| `src/lib/blueprint/components/` | Header, Menu (the index of all 18 chapters), Footer, Next, Intro, Viewer, Picture, Actions, Text |
| `src/lib/blueprint/motion.ts` | edition-wide behaviour and per-page scroll scenes |
| `src/lib/blueprint/styles/` | `tokens.css`, `base.css`, `blocks.css`, `motion.css` |
| `src/lib/blueprint/assets/` | logo, symbol and word mark as SVG, coloured by the current text colour |
| `src/routes/blueprint/` | layout (fonts, styles, transitions, language switch) and the route for both languages |
| `public/bp/img`, `public/bp/video` | the edition's own photographs and films |

**Routes:**
- `/blueprint/<page>/` in English and `/blueprint/es/<page>/` in Spanish;
- 36 prerendered pages in all;
- `scripts/write-route-index.mjs` lists them and sets `lang="es"` on the Spanish HTML;
- `scripts/build-pages.mjs` adds `bp/` to the Blueprint Pages artifact.

## Content rules

- **Placeholders.** Bracketed text such as `[x]`, `[rate]` or `[price]` marks facts not supplied yet. It is shown as a dotted, muted placeholder and is never filled with invented values.
- **Actions without a destination.** A table reservation, a retreat enquiry, studio email, footer visit and contact links, and policies explain that the link is not connected yet. They do not pretend to work.
- **Booking** opens the partner booking page.
- **Newsletter.** It sends and stores nothing, and says so.

### Changes from the Figma copy

| Page | Change |
|---|---|
| All | Generic "Button" controls removed. Eyebrow labels above every heading removed; the hero shows the chapter number and its group instead. |
| Home | "A dome of wood and glass" dropped: the photographs and the Brand Bible show a copper-scaled projection dome. The Brand Bible's line "Just come curious. The rest is between you and The Vessyl." added as the lede. Its manifesto closes every page in the footer. |
| Horses and the River | "[Name], who has worked this land for [x] years" became "Enrique Molina, whose family has worked with horses in La Fortuna for generations" (Brand Bible). |
| Horses and the land | "[x] acres" became 118 acres, as the home page states. The three ride types got horse photographs; the Figma file reused massage and sound pictures. |
| The Frequency Dome | Credits from the Brand Bible added to the facts: spatial audio by Kling & Freitag and IOSONO, 24 Clark Synthesis transducers, projection by The Elumenati. |
| Sound and movement | Facilitators named from the Brand Bible: Dylan Baird (breathwork and meditation), Ashley Marie (vibrational yoga), Svetlana Parmar (readings). |
| For Two | Steps follow the page's own description: dusk, the Dome, then dinner. |
| Where you sleep and its sub-pages | Treehouse photographs follow the owner's identification. The tent on stilts stays with the glamping tents. |

## Spanish

- `content/es.json` maps every English string to its es-LA translation. English edits leave the Spanish as a missing entry, never as a silently wrong one.
- `node scripts/blueprint-strings.mjs` collects every string the edition shows: content, page names, and interface text from `t('…')` calls and `// i18n:` lists. It is part of `npm run check` and fails when Spanish is missing or keeps strings the site no longer shows. `--list` prints the strings for translators.
- The translation was made with the `translate-to-es-la` skill in three batches, followed by an independent QA pass over the whole file.
- Conventions:
  - informal "tú";
  - units are not converted;
  - names stay in English: The Vessyl, The Frequency Dome, The Harmonic Hearth, The Vessyl Presents and the program names;
  - "el Domo" after the first mention;
  - page names are translated (Dónde dormir, Las villas, La casa del árbol…).

## Media

**Photographs** are web derivatives of the brand's 45 MP masters and its 2K editorial series.
- Recipe: `scripts/blueprint-media/photos.py` with `photos.tsv` (names to source files on the owner's machine).
- Sizes: 640, 1080 and 1600 px at quality 80; 2400 px at quality 70 (`recode-2400.py`).
- `data/photos.json` holds sizes and a placeholder colour.
- Images the Figma edition already published (night exteriors, the volcano, the studio, the founder, press marks) are reused read-only from `public/media`.

**Films and loops:** `scripts/blueprint-media/videos.sh`, `videos-pass2.sh` and `videos-home.sh`. Encoding: H.264 High, yuv420p, `faststart`.

| File | Source | Use |
|---|---|---|
| `loop-pool` | VESSYL.mp4 0:55–0:59.6, played forward and back | Home hero |
| `loop-night` | vessyl-web.mp4 0:00–0:25.4 | spare night loop |
| `loop-dome` | Programming 1:03.8–1:09.4, forward and back | The Frequency Dome |
| `loop-hearth` | VESSYL.mp4 0:10.8–0:14.5, crossfaded | The Harmonic Hearth |
| `loop-river` | Overview 0:41.5–0:44.8, crossfaded | Horses and the River |
| `loop-stars` | vessyl-web 0:02–0:03.9, slowed, forward and back | Arenal After Dark |
| `loop-violin` | Overview 1:10.3–1:12.6, crossfaded | The Vessyl Presents |
| `loop-studio` | Events reel 0:19–0:24.4 | The recording studio |
| `loop-pool` (2026-11-03) | `VESSYL.mp4` 0:54.5–1:00.5, crossfaded, 2560 px from the 4K master, 1280 px copy for phones | Home hero; replaces the forward-and-back cut |
| `loop-treehouse` | Overview 1:20.6–1:22.7, slowed by half and crossfaded | Home, the treehouse door |
| `loop-house` | Overview 1:53.4–1:58.0, crossfaded | Where you sleep hero and the home page's next-page block |
| `film-vessyl` | VESSYL.mp4, 61 s, music, loudness −16 LUFS | Home film |
| `film-events` | Events reel 0:05.6–0:55.8, voice and music, −16 LUFS | The Vessyl Presents |

Loops are silent and start only while visible. Films follow the legacy behaviour described above.

Left out on purpose:
- social cuts that mention psychedelic plants;
- the dated Tapado announcement;
- stock-looking animals;
- the old "VESSYL AKEN SOUL" lockup.

## Verification (2026-11-02)

- **Build and checks.** `npm run build` and `npm run check` pass:
  - Svelte types;
  - 54 routes with one `h1`, shell, local links and assets;
  - Spanish coverage;
  - Figma freeze (246 files unchanged).
- **Accessibility.** axe-core reports no violations on all 18 pages at 1440 and 375 px.
- **Scroll storyboards.** Captured for every page at 1440×900, and for home and the Hearth at 390×844.
- **Interactions tested in headless Chrome:**
  - menu open and Escape;
  - gallery viewer with arrow keys and Escape;
  - not-yet-connected links;
  - the language switch, which keeps the scroll position;
  - menu navigation with the fog transition;
  - film playback states, matching the legacy component;
  - the opening mark and its once-per-visit memory.
