# Blueprint home: the stage and the sheets

The home page as rebuilt on 2026-11-03, after the owner accepted the direction found in the references (`docs/blueprint-references.md`) and asked for it "much more carefully, at a perfect level". It replaces the earlier storyboard of scenes on one ground.

## The idea

The page is told in places. Each place plays on a fixed, full-screen stage, and its word stands between the subject and what is behind it. The woman in the pool, the Dome and the couple at dinner stand in front of their words.

The words sit on sheets that slide over the stage:
- paper by day, night after the Dome;
- the top edge of each sheet is the Dome's curve.

Between sheets an opening shows the next place. It surfaces from mist, the brand's only transition.

| Place | Word (es) | Picture | Subject in front of the word |
|---|---|---|---|
| Arrival | ARENAL (Arenal) | `VESSYL.mp4` 0:54.5–1:00.5, the pool facing the volcano, a 5-second crossfaded loop | the woman, matted frame by frame |
| Film | none | the brand film's silent preview; a tap starts the full film with sound | none |
| Sound | SOUND (Sonido) | Dome Extensions 13, the copper scales against the sky, 45 MP | the Dome |
| Table | TABLE (Mesa) | Z92_8400, dinner for two at sunset, 45 MP | the couple |

## Order

1. **Arrival.** ARENAL stands over the treeline beside the woman, whose raised arms reach toward its first letter. The first sheet rises over the water.
2. **Paper sheet:**
   - the invitation: "Just come curious. The rest is between you and The Vessyl." in the italic, beside what the place is and the two ways in;
   - the parts of the land: four equal pictures, each opening its page;
   - the three ways to stay.
3. **Film.** "A minute on the land", playing quietly, with "Watch the film with sound" and, after the tap, pause and sound controls.
4. **Paper sheet.** The six experiences walk sideways as the page scrolls.
5. **Sound.** SOUND above the curve of the Dome. The sky is deepened by a polariser on everything behind the Dome, so the word reads.
6. **Night sheet:**
   - inside the Dome, the ceiling's projection drifts from Mars to waves to blue as the words change;
   - taking the whole property;
   - where you actually are.
7. **Table.** TABLE over the forest at sunset, the couple in front of it.
8. **Night sheet:**
   - dinner;
   - Robert Patterson's words and Josh Stanley;
   - the press marks.
9. **The next page.** "Where you sleep", with its round arrow and the main house breathing in an arch that opens.
10. **Footer.**

## How a place is drawn

`src/lib/blueprint/stage.ts` draws the active place in one WebGL pass: the picture, the word behind the subject, mist while the place surfaces, a light shade under the header, and grain.
- **Matte.** The subject's matte travels with its picture in one opaque file, so the two can never drift apart:
  - films side by side, the matte on the right half;
  - stills one above the other, the matte below. Side by side they would pass the 4096-pixel texture limit of older phones.
  - Not in an alpha channel: Safari decodes alpha premultiplied, which turned the sky black behind SOUND and TABLE.
- **The word reads.** Behind the subject each crop is dimmed (`dim` in `stages.ts`) until the word stands at least 3:1 against the picture right around its letters, measured on the drawn place at seven sizes. The subject keeps its own light. Bright skies are also deepened by a polariser, and a soft shade sits just behind the letters.
- **Word placement.** The word is placed in the picture's own coordinates (`src/lib/blueprint/stages.ts`), so it keeps its place on the picture at any screen size. Phones have their own upright crops.
- **One letter height.** Every word has the same capital height: 13.5 % of the picture's height on wide screens and 6.6 % on phones. They read as one set of inscriptions, and Spanish words keep the same letter height as English ones.
- **Pointer.** The picture and the word move at different depths.
- **Breathing.** A still breathes: an eased push toward its subject and back, sixteen seconds each way.
- **The first word.** As the reader scrolls on, the word rises out of its place.
- **Sleeping.** While a sheet covers the screen nothing is drawn and the films pause. The stage changes place unseen, so the next place is already there when the sheet ends.
- **Plain layers.** Without WebGL, under reduced motion, and if the WebGL context is lost or a place fails to load, plain layers stand in: the picture deepened by the same polariser and dimming, the word, and the subject cut out on top. Each crop is framed on its own focus. Their pictures load only when needed; the first place's picture loads at once, for a page without scripts.
- **Resizing.** A resize reloads a place only when its crop changes (a phone turned, a window made upright). A place that has not loaded for the new crop leaves the stage dark rather than show the place before.
- **The film.** The preview plays silently while the opening is in view. After "Watch the film with sound" the film starts from the beginning with sound, focus moves to its controls, and from then on only the controls play it: scrolling away pauses it, coming back does not resume it, and at its end it stops and waits. The pause button names what it will do next ("Pause the film" or "Play the film") and shows the matching icon; "Mute the film" is a pressed toggle.

Mattes come from macOS Vision (`scripts/blueprint-media/matte.swift`).
- For the pool, every frame takes the stronger of the person matte (fine hair) and the subject matte (the whole figure when the arms are raised), averaged over neighbouring frames so the edge does not shimmer.
- A still's matte is drawn in along hard edges (3 pixels on the Dome, 1 on the couple), so the sky caught along the edge goes with the sky; once the sky is dimmed, a caught edge would shine as an outline. The lens's green fringe along the Dome's rim is taken out.
- `scripts/blueprint-media/stage-media.sh` makes every file in `public/bp/stage/`.

## Checked on 2026-11-03

After the deep QA (`docs/blueprint-review.md`, "Deep QA of the home page"):
- **Every size.** 18 screen sizes from 320 × 568 to 3440 × 1440, phones both ways up, tablets, and five sizes under reduced motion. The word stays inside the screen's margins, below the header and above the sheet at every size; it is read from the page itself.
- **Every engine.** Chrome, WebKit (Safari's engine) and Firefox, on desktop, phone and tablet sizes. All places are drawn in each.
- **Word contrast.** At least 3:1 against the picture right around the letters, at seven sizes; at least 2:1 against the brightest tenth of it.
- **Smoothness.** No frame over 20 ms at 1440 × 900 (ratio 1 and 2), 2000 × 1143, 2560 × 1440 at ratio 2, and with the CPU slowed four times at 1440 × 900, 768 × 1024 and 390 × 844 (ratio 3).
- **Layout shift: 0.** Largest paint: 0.5 s on a fast connection, 2.5 s on slow 4G with the CPU slowed four times. Blocking time: under 35 ms.
- **Behaviour.** 35 checks pass:
  - resizing and turning a phone;
  - ten round trips between pages;
  - a lost WebGL context;
  - a hidden tab;
  - a slow network and no JavaScript;
  - the film by keyboard, to its end and back;
  - a place still loading;
  - the language switch;
  - the Frequency Dome page's projection;
  - which file each screen loads.
- **Interactions** (14 checks), **accessibility** (axe-core, 54 runs) and **all 36 pages** in both languages, read to the end at two sizes with and without reduced motion: no errors, no violations, no failed requests.
- **Weight of the first screen**, with the other places loaded while the browser is idle:
  - desktop: 6.2 MB, or 7.2 MB at ratio 2;
  - tablet held upright: 5.5 MB;
  - phone: 3.9 MB, or 4.6 MB at ratio 3.
