# Blueprint review, 2026-11-03

The owner reviews the published rebuild (commit `ac821a7`) point by point before the next update. Each remark is quoted as given, followed by what it shows and what the update changes.

The owner's screenshots are 2000 px wide with the header at its normal size. The window is therefore about 2000 CSS pixels wide at a device pixel ratio of 1. The measurements below were taken on the live home page at 2000 × 1143.

## 1. Page numbering

> «зачем ты вставляешь вот такой нейрослоп с нумерацией страниц?»

The remark is about the line above the hero title, "01 / 18   Arenal, Costa Rica".

**Why it was there.** The Figma copy put an eyebrow label above every heading. The rebuild removed those labels but kept the slot above the hero title. It filled the slot with a chapter counter to tie the hero to the numbered menu and the "Next" link, under the "one day in 18 chapters" idea.

**Why it is wrong.**
- Visitors do not read the pages in order. They arrive from search, the menu and links, so "01 / 18" is the site's internal index and says nothing about the place.
- "Arenal, Costa Rica" repeats the home title. On the other pages the group name is a breadcrumb dressed as a label.
- It is the template pattern the rebuild set out to remove.

**Update.**
- Remove the line above the title on all 18 pages in both languages: `blocks/Hero.svelte`, and `.hero-mark` and `.hero-count` in `styles/blocks.css`.
- Remove the page numbers from the menu (`components/Menu.svelte`) and from the next-page link (`components/Next.svelte`).
- Keep numbers only where the content has a real order. In For Two (dusk, the Dome, dinner) and the Harmonic Hearth (heat, cold, sound, together) the steps follow one another. The Frequency Dome's three uses (sound sessions, movement and breath, performance) are not a sequence and lose their numbers.
- Drop the Spanish strings that disappear, so the coverage check stays clean.

## 2. A screen of text alone

> «на первом же экране мы видим просто белый экран и просто текст, притом два текста в вакууме. не надо так делать»

The remark is about the statement block after the home hero. It holds one long sentence at display size and a second paragraph pushed to the right, on a plain ground.

**Why it was there.** The statement block was meant as the page's voice between pictures, carried by the word-by-word brightening. The second paragraph was offset to the right for an editorial asymmetry.

**Why it is wrong.**
- There is nothing to look at: no picture or film, only text on an empty ground.
- The two texts float apart, so neither anchors the other.
- Half the sentence stays pale until it is scrolled through.
- The block is used 17 times on 13 pages.

**Update.**
- Retire the statement block. No screen shows text without a picture or film.
- Text sits next to its picture. Secondary text stays in the same column as the text it belongs to.
- Content that lists things becomes pictures with short captions. On the home page, "a river you can swim in, horses, a kitchen that changes its menu every day, and a founder who lives here" becomes four pictures.
- The word-by-word brightening goes with the block.

## 3. Giant spacing

> «гигантские отступы с гиганстким пустым пространством»

Shown on the home page's "Fourteen units, no two the same" and "You do not have to stay here to come here" sections.

**Measured** on the live home page at 2000 × 1143:
- between ordinary blocks: 241–304 px of empty ground, 21–27 % of the screen;
- where the tone changes: 401–413 px, 35–36 % of the screen;
- in the treehouse section, about 400 px between the picture and its text;
- in the doors section, about 650 px between the heading and its intro, which sits at the far right.

**Why.**
- `--space` is `clamp(96px, 12vw, 196px)`. Every block pads both its top and its bottom, so two paddings stack between blocks (196 + 108 px at this width).
- A tone change adds `min(8vh, 72px)` more.
- Split and doors layouts put the picture and the text at opposite edges of a 12-column grid, with empty columns between them.

**Update.**
- One gap between blocks instead of two stacked paddings. It is about half today's height and the same on every tone.
- In split layouts, picture and text sit together, one gutter apart and aligned to each other.
- Intros stay next to their headings.
- After the change, measure the empty bands again at 2000 × 1143, 1440 × 900 and 390 × 844.

## 4. Gradient transitions between blocks

> «очень резкий градиентальный переход между блоками, просто ужасно»
>
> «опять огромный, пустой и резкий градиентальный переход»

Shown at the home page's change from the film to dinner (clay to forest) and from the retreat to the night section (petrol to night).

**Why it was there.** The page was meant to move from day into night, like the property. Every change of tone opened with a 300 px gradient from the previous colour.

**Why it is wrong.**
- A gradient between a light and a dark colour passes through grey mud.
- Each band adds about 400 px of empty ground (point 3).
- There are 24 such bands on 13 pages, and the home page alone changes tone five times.

**Update.**
- Remove all gradient bands. A tone changes at a clean edge.
- Fewer tone changes per page: light sections together, dark sections together.
- Where a page goes from light to dark, a full-width picture or film carries the change, not a coloured band.

## 5. Text over a detailed photograph

> «текст написан поверх высокодетализированной фотографии, что серьезно уменьшает его читаемость»

Shown on the home page's Dome section, "The Dome is the reason this place exists". A heading, two paragraphs and two links sit over a full-screen photograph of a session. The photograph is darkened only lightly: about 20 % in the upper part and 68 % at the bottom edge.

**Why it was there.** The chapter block was meant to be a full-screen moment. The darkening was kept light so the photograph stays visible.

**Why it is wrong.**
- The text runs across gongs, people and the Dome's lines.
- The block is used 7 times on 7 pages: home, Experiences, Day and half-day, Frequency experience, Arenal after dark, the Harmonic Hearth, and Horses and the land.
- On phones the layout already puts the words below the picture. Desktop does not.

**Update.**
- No paragraphs or links over photographs. The picture shows full screen on its own, and the words follow on the page's ground, as on phones.
- If anything stays on a picture, it is one short heading over a calm, dark part of it, such as sky or a wall, with enough darkening for full contrast.

## 6. Paragraph text is too small

> «текст абзаца мельтишит»
>
> «текст простых абзацев везде мельтишит. мельтишит – он очень маленький»

First shown on the home page's "Take the whole property" section. The owner then made clear that it applies to plain paragraphs everywhere and means the text is too small.

**Why.**
- Reading text is `--t-body: clamp(1.125rem, 1.06rem + 0.22vw, 1.3rem)`, so it stops growing at 20.8 px. Ledes stop at 25.6 px.
- EB Garamond has a small x-height, so 20.8 px reads like about 17 px of an ordinary sans serif. Antialiased smoothing thins it further, most of all in light text on dark grounds.
- On a 2000 px screen these paragraphs read as fine print, with lines of up to 32 em, about 75 characters.

**Update.**
- Reading text gets larger and keeps growing on wide screens, and ledes get larger still. The sizes are set by eye at 2000 × 1143, 1440 × 900 and 390 × 844.
- Lines get shorter, about 60–65 characters, with enough line height for the serif.
- Reading text on dark grounds gets a slightly heavier weight and normal font smoothing.

## 7. Photographs without rounding or effects

> «у фото нет даже базового скругления, не говоря уже о каких либо других эффектах»

Shown on the same section: a 4:3 photograph with square corners.

**Why.**
- Only portrait pictures got the arch. Landscape pictures, the film frame and the gallery stayed square.
- Their only effect is a drift of the image inside its frame (±5 %), which reads as no effect at all.

**Update.**
- Every picture has rounded corners from one radius scale. Portrait pictures keep the arch.
- Pictures get visible, calm motion. They open from a smaller rounded mask as they enter the screen and settle from a slight zoom. The drift inside the frame becomes noticeable.
- Clickable pictures (doors, gallery) respond to the pointer.

## 8. The next-page block

> «огромные пустые блоки. нейрослопная надпись "Next 02". чрезвычайно мелкое фото
> блок должен заинтересовать кликнуть, чтобы перейти на другую страницу, но выглядит просто ужасно»

Shown at the end of the home page: "Next 02", "Where you sleep" and a small arch picture at the far right, on a full screen of night.

**Why it was there.** The block was built as a quiet close under the "chapters" idea. It had a chapter label and number, the next page's name, and a small preview that would not compete with the footer.

**Why it is wrong.**
- Its job is to make the visitor want the next page, yet it barely shows that page: the picture covers about 6 % of the screen.
- The label, the name and the picture sit at three corners of an empty screen.
- "Next 02" is chrome (point 1).

**Update.**
- The block shows the next page's picture or film large, across most of the screen width, with the page's name on it or right beside it.
- One line from that page's own description says what is there, so there is a reason to click.
- The whole block is one link. The picture responds to the pointer. As the block scrolls into view, its arch opens the way the next page's hero opens, so the click continues the same movement.
- No "Next" label and no number. The block is no taller than its picture.

## 9. Page openings with a still photograph

> «на второй странице where-you-sleep вместо короткого hero-видео в заглавной карточке просто фото. если тебе нравится это фото, ты должен был преобразовать его в loop-видео или взять фрагмент из видео»

**Why.** Video was chosen by each page's meaning, and only the home page got a hero video by default. Seven pages open with a loop and eleven with a still: Where you sleep, the Villas, the Treehouse, the Glamping tents, Rates and offers, Experiences, Day and half-day, Frequency experience, For Two, Sound and movement, and Horses and the land.

**Why it is wrong.**
- The opening is the page's first impression, and the brand's footage covers several of these places.
- The Where you sleep photograph is a drone still of the main house and pool. The Overview film has the same view from the drone at 1:53.4–1:58.0, and the study catalogue already listed it.

**Update.**
- Every page opens with a short silent loop.
- Where footage of the place exists, the loop is cut from it:
  - Where you sleep: Overview 1:53.4–1:58.0, the main house and pool from the drone;
  - the Treehouse: Overview 1:20.6–1:22.7, the Sky Tree House from the drone;
  - the other pages: matched against the catalogue in `study/4-videos.md`.
- Where no footage exists, the loop is made from the photograph itself with a slow camera move or depth. Nothing about the place may be invented.
- Drone moves loop with a crossfade, because played backwards they show.
- The masters are 1080p. Full-screen openings at 2000 px would be sharper from the editor's 4K masters, if they exist.

## 10. Pictures of different shapes and sizes

> «Фото почему-то имеют совершенно разные размеры форму. А фото с частотным куполом вообще имеет закругленную форму купола. То есть вообще нет консистентности в визуале.»

Shown on the reworked home page's land scene. Its six pictures had five proportions (arch, 3:2, 1:1, 4:5, 16:10), and the Dome sat in an arch among rectangles. The stay scene mixed the same shapes.

**Update (applied 2026-11-03).**
- Every picture on the site has one shape: a rectangle rounded from one scale. The arch is no longer a picture frame anywhere: not for portraits, doors, steps, the founder or the menu preview.
- The Dome's arch stays as movement only: the hero opening, nightfall and the next-page opening.
- One group, one proportion:
  - the land's six pictures are 4:5 and the same width, in two aligned columns;
  - the three stay doors are equal 4:5 doors in a row;
  - the experiences rail is 4:5.
- Upright pictures across the site are 4:5 and landscape pictures 3:2. The film keeps 16:9.

## Found in the owner's screenshots

**A smudge under the header.**
- The header is frosted glass: 70 % paper with a 16 px blur. Text and pictures scrolling beneath it show as a smudge: grey on light pages, brown above the next-page block.
- It is visible above the "Fourteen units" section and was confirmed on the live page.
- Update: once the page scrolls, the header gets an opaque ground with no blur.

## Status, 2026-11-03

The owner asked to rework the home page first and see it before the other seventeen pages. The home page is rebuilt from the storyboard in `docs/blueprint-home.md`.

**Applied on the home page.** Points 1–9 and the header.

**Applied to every page through shared styles:**
- point 1: no counter above the hero, no numbers in the menu or the next-page block;
- point 3: one gap between scenes;
- point 4: no gradient bands; tones change at a clean edge;
- point 5: the chapter picture stands alone, and its words follow on the ground;
- point 6: larger reading text;
- point 7: rounded pictures that arrive from depth;
- point 8: the new next-page block;
- the solid header.

**Applied to Where you sleep.** Point 9: its opening loop is the main house from the drone.

**Still to do on the other seventeen pages:**
- retire their statement blocks (point 2);
- give each page its own scenes;
- give every opening a loop (point 9).

**Measured on the home page** with motion reduced, so the layout stands still:

| Window | Between scenes | Where the tone changes |
|---|---|---|
| 2000 × 1143 | 128–184 px (11–16 %) | 0 px; the film runs straight into the dusk photograph |
| 1440 × 900 | 92–168 px | 0 px |

The first rebuild measured 241–304 px between scenes and 401–413 px at tone changes at 2000 × 1143.

## Home page audit, 2026-11-03

The owner asked for a full audit before rolling the home page out: quality, spacing, sizes, motion that never stutters, and a premium look. Tools: headless Chrome driving the built site.

**Motion.** Wheel-scrolled through Lenis while every animation frame was recorded:

| Window | Frames | Median | Slower than 34 ms |
|---|---|---|---|
| 1440 × 900 | 831 | 16.7 ms | 0 after fixes (3 at the opening before) |
| 2000 × 1143 | 842 | 16.7 ms | 0 after fixes (1 of 137 ms before, when the last loop started) |
| 2000 × 1143, CPU slowed 4× | 900 | 16.7 ms | 0 |
| 820 × 1180 | 882 | 16.7 ms | 0 |
| 390 × 844 | 718 | 16.7 ms | 0 |

Layout shift during the scroll is 0.000.

**Interactions**, all passing:
- the hero loop plays;
- the skip link takes the first focus;
- the menu opens, lists 18 pages without numbers and closes on Escape;
- a link without a destination explains itself;
- the film plays silently and a tap restarts it with sound and controls;
- only visible loops play;
- the language switch keeps the place;
- the next-page block opens Where you sleep with its loop;
- reduced motion leaves a still page;
- there are no console errors or failed requests.

**Accessibility.** axe-core finds no violations on the home page at 1440 and 375 px, the Spanish home page, and Where you sleep.

**Weight.** The first screen is 4.3 MB on desktop and 2.8 MB on phones. A full scroll was 38 MB and 31 MB, almost all of it the brand film playing silently. It is now 21.7 MB and 11.3 MB.

**Found and fixed:**
- The closed hero arch cut the swimmer at its edge. The arch now centres the picture's focus point (`--fx`, from the media's `focus`).
- The land's first picture drifted up over the hero's bottom edge. The top and bottom rows are now nearer layers, the middle row farther, and the drift is smaller, so no picture leaves its scene.
- The nightfall scene showed the same couple twice. The second picture is now the table being served.
- The Dome's projection turned as the page moved, which read as a tilted horizon. It now drifts by a slow zoom.
- The main house loop came from an overcast drone clip with a metal shed in view. It is now made from the sunny 45 MP drone still with a slow, eased camera breath (`videos-home.sh house`). It opens Where you sleep and the home page's next-page block.
- The footer was text alone. Its closing lines now sit beside the Dome under the Milky Way.
- Loops now start buffering a screen before they arrive, so starting to play no longer stutters.
- Films play a silent 12-second preview while in view and load the full film with sound only when tapped (`film-previews.sh`).

**Left for the owner:**
- The river, treehouse and Dome loops come from 1080p masters. Full-screen use on wide screens would be sharper from 4K masters, if the editor has them.
- The founder's portrait, from the approved Figma edition, has plants behind him that some viewers may read as cannabis.
- Bracketed placeholders such as `[x]`, `[rate]` and `[hours]` remain visible until the facts are supplied.

## Rollout to all eighteen pages, 2026-11-03

After the home page audit the owner asked to roll its level out to every page. Each page was rebuilt from its storyboard in `docs/blueprint-pages.md`.
- **Openings.** Every page opens with a loop. Nine are new: two cut from footage (the tents from the drone, the Dome from inside) and seven made from brand photographs with a slow camera breath (`scripts/blueprint-media/loops-pages.sh`).
- **Retired blocks.** Statement, chapter, quote, founder and press.
- **Pictures beside text.** Facts, notes, tables and events carry a picture beside their words.
- **Galleries** are equal 4:5 tiles.
- **Steps** show numbers only for a real order. Inactive steps are no longer faded, so every step stays readable.
- **The Presents newsletter** moved into the footer.
- **The Hearth** goes into the night through the nightfall arch.

**Audit of all eighteen pages:**
- **Screens without a picture, at 1440 × 900:** 0 on every page.
- **At 390 × 844:** none outside the footer's page index, apart from one screen of notes on the Frequency Dome and one at a scroll boundary of the Treehouse facts.
  - The facts list now sits two to a row on phones.
- **Accessibility:** axe-core reports no violations in all 54 runs: 18 pages at 1440 and 375 px in English, and at 1440 px in Spanish.
  - The only findings before the fix were the faded inactive steps.
- **Motion:** wheel-scrolled at 1440 × 900 with no frame slower than 34 ms:
  - the Frequency Dome: 712 frames;
  - the Harmonic Hearth: 691;
  - The Vessyl Presents: 462;
  - Where you sleep: 390.
- **Gallery viewer:** opens on a tile, steps with the arrow keys, closes on Escape.
- **Project check:** passes for types, all 54 routes, the Figma freeze (246 files) and Spanish (617 strings).

**For the owner to confirm:** the aerial of small pyramid roofs on a curving path (`VESSYL.mp4` 0:24) is read as the glamping tents, because the path matches the tent photographs.

## 11. The next-page block gave no sign it could be clicked

> «рядом с самой надписью нету даже какого-то минималистичного значка ссылки. То есть, ну, непонятно, что туда можно и нужно кликнуть»

Shown on the home page ("Where you sleep") and on the Villas ("The Treehouse") on desktop.

**Update (applied 2026-11-03).** A round arrow follows the next page's name at every size and in both languages. It stays with the last word, so it never wraps onto a line of its own. When the block is pointed at or focused, the arrow fills with copper and the name takes the accent colour.

## The stage and the sheets, 2026-11-03

After the references were studied (`docs/blueprint-references.md`), the owner rated the first prototype 3 out of 10, asked for 9 or 10, and accepted the direction: "do it much more carefully, at a perfect level". The home page is rebuilt on a WebGL stage (`docs/blueprint-home.md`).

**What changed from the prototype:**
- **Mattes.** They come from macOS Vision instead of a brightness scan. The pool's woman is matted frame by frame from the 4K film.
- **Composition.** Words are composed in the picture's coordinates, with one capital height across places and languages. The prototype's words collided with the header and lost letters behind the volcano.
- **Contrast.** A polariser deepens bright skies behind the word. A light shade keeps the header legible over the stage.
- **One canvas.** The stage is a single WebGL canvas that sleeps while a sheet covers it. The prototype used layered images moved every frame.
- **Plain layers.** Plain layers serve reduced motion and browsers without WebGL.

**Found and fixed while building:**
- The person matte lost the woman's head when her arms went up. The stronger of the person and subject mattes is taken every frame, smoothed over three frames.
- Her head hid the first letter of ARENAL. The word moved beside her, so her raised elbow only touches the A.
- The stage took the film block's 16:9 shape on phones because of a class-name clash. Renamed.
- A layout shift of 0.10 at load came from the plain word moving into place and the italic arriving late. The word is hidden while the canvas draws, the first screen's faces are preloaded, and the shift is now 0.
- The font preloads used root paths that GitHub Pages would not serve under `/blueprint/`. `scripts/build-pages.mjs` now re-roots `/_app/` as well.
- The plain layers loaded every place's pictures at once. They now load only without WebGL, saving 1.6 MB on the first screen.
- Across the sheets, section heads use one layout and one size, and the flipped split aligns to the sheet's left edge.

## Deep QA of the home page, 2026-11-03

> «Давай сначала намного более мощный QA, на всех уровнях, по коду и на всех разрешениях, и только потом»

Done before the stage goes to the other seventeen pages. An independent code review of the stage was combined with tests in three browser engines and at every screen size.

**Found and fixed:**
- **The Frequency Dome page broke.** The stage looked for `[data-stage]`, and that page's projection used the same attribute. The stage code then failed and every scroll scene on the page stopped. The projection's pinned block is now `[data-pin]`, and the stage does nothing on a page without places.
- **Safari blackened two places.** It decodes alpha premultiplied, so with the matte in a still's alpha channel the sky behind SOUND and TABLE turned black. Mattes now travel in the opaque file itself: films side by side, stills along their short side (within a 4096-pixel texture).
- **The words did not read on bright skies.** Measured against the picture right around the letters, SOUND stood at 1.4:1, TABLE at 2.2:1, and ARENAL at 2.1:1 on phones. Each crop now dims what is behind its subject until the word reaches 3:1; the subject keeps its own light. Pulling the matte in by 1–3 pixels removed the bright outline the dimming exposed along the Dome, and the lens's green fringe on its rim was taken out.
- **Words left the screen.** On tablets held upright ARENAL rose under the header; at 1024 × 768 and 1180 × 820 it ran off the right edge. The word now keeps within the margins and below the header: a word set beside its subject narrows, any other moves in.
- **Resizing reloaded everything.** Every resize refetched each place and restarted the film; on phones the address bar alone causes resizes. A place now reloads only when its file changes.
- **The film.**
  - After its end it started again by itself, with sound.
  - Coming back to it resumed it, and jumping away left it playing under the sheets.
  - It now plays only from its controls once opened, stops at its end, and stops when the reader leaves.
  - Focus moves to its controls when the play button gives way to them.
  - The pause button names what it will do and shows the matching icon. "Mute the film" is a pressed toggle; before, its label meant the opposite of its state.
- **A place before its time.** While a new place loaded, the canvas kept showing the previous place and its word. It now stays dark until the place arrives.
- **Failures.**
  - Neither a lost WebGL context nor a place that failed to load fell back to the plain layers. Both now do, and a stalled film no longer waits forever.
  - The language switch started two navigations at once and logged "navigation aborted". It now listens before the router.
  - After a switch of language, the canvas could still write the previous language's word. The word now comes from the page itself.
- **Soft upright crops.** Tablets held upright and large phones enlarged the phone crops by 1.4 to 2.1 times. They now load the same crops at 1440 × 2560 for stills and 1080 × 1920 for the pool film.
- **Smaller fixes:**
  - the canvas draws at most 6 megapixels and uploads a film frame only when there is a new one;
  - the mist's noise is computed only while there is mist;
  - the word's halo no longer ends in a step at its texture's edge;
  - the canvas follows the stage's own width, without the scrollbar;
  - hidden tabs pause the silent films;
  - the plain layers frame each crop on its own focus and stay up until the canvas has faded in;
  - the page no longer depends on `:has()` to keep the footer above the stage;
  - header controls are at least 44 pixels on every touch screen;
  - the Pages build now checks the stage's deferred pictures, posters and the film as well.

**Checked and found correct:** the pool film's colour matrix. Re-encoding with an explicit BT.709 matrix gave a byte-identical file, because ffmpeg 9 already takes it from the output tags.

**Results** are in `docs/blueprint-home.md`, "Checked on 2026-11-03".

**Still open, for the owner:** three supplied pictures are smaller than the screens they fill:
- Josh Stanley's portrait (800 px);
- the volcano (1024 px);
- the Milky Way (1791 px).

Under reduced motion, a tablet held upright still shows the phone's plain pictures (1080 px).

