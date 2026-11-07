# Figma Enhanced — design system (step 1, 2026-11-08)

This is the system under all 28 pages of `/figma-enhanced/`. It was built in step 1 of `docs/figma-enhanced-plan.md`, against the numbers in `docs/figma-design-audit.md`.

The pages keep the designer's content and section order. The system decides how every section looks by its role (`data-role`, `data-variant`, `data-name`), so the same kind of section looks the same on every page. `/figma/` is untouched.

## Files

| File | What it holds |
| --- | --- |
| `src/lib/enhanced/styles/tokens.css` | Every value: colour roles, type scale, grid, spacing, radii, shadow, motion. |
| `src/lib/enhanced/styles/system.css` | The page system: grid and bands, type, actions, photographs, the three hero types, each section role, the closing photograph and newsletter, the footer colour, tablet and phone layouts. Written only in token terms. |
| `src/lib/enhanced/styles/focus.css` | Where each photograph's subject sits (`object-position`), taken from the designer's crops. |
| `src/lib/enhanced/styles/shell.css`, `shell-edition.css` | Header, menu and footer layout carried over from the Figma edition. The header is redesigned in step 2. |

The markup carries three system attributes:
- `data-band` on a section: its surface;
- `data-hero="split"` on an opener: its hero type;
- `data-part="term"`: the term of a fact, such as "Check-in" or "Diameter".

## Tokens

### Colour roles

| Role | Value | Use |
| --- | --- | --- |
| `--ink` | #262626 | Text. |
| `--ink-soft` | #57504a | Terms, table heads, secondary lines. |
| `--heading` | #364830 | Headings, fact values, links. |
| `--heading-deep` | #1a3013 | Primary button hover. |
| `--accent` | #a2551b | Copper: price lines, the rate card label, offer tags. |
| `--accent-on-dark` | #e3b791 | Copper on forest and night. |
| `--surface` | #ffffff | Page. |
| `--surface-warm` | #f5ebe7 | Beige bands and panels. |
| `--surface-forest` | #364830 | Forest bands. |
| `--surface-night` | #161a11 | Footer, and the foot of the closing photograph. It is the darkest tone of the night photographs. |
| `--on-dark` | #f5ebe7 | Text on forest and night. |
| `--rule`, `--rule-strong` | #ecdfd8, #dabfb6 | Rules under facts, events and table rows. |

Contrast, measured (WCAG ratio):

| Text | On white | On beige | On forest | On night |
| --- | --- | --- | --- | --- |
| ink | 15.1 | 12.9 | — | — |
| ink-soft | 7.9 | 6.8 | — | — |
| heading | 9.9 | 8.4 | — | — |
| accent | 5.5 | 4.7 | — | — |
| on-dark | — | — | 8.4 | 15.1 |
| accent-on-dark | — | — | 5.4 | 9.6 |

White on the copper header button is 5.5:1. axe reports no contrast issue on any page.

### Type

EB Garamond for display and headings, Roboto for text, as the owner decided. Sizes are fluid between 375 and about 2000 CSS px; the values below are at 1440.

| Style | Font | Size / line | Where |
| --- | --- | --- | --- |
| Display | EB Garamond 400 | 68 / 70 | The page H1, and the opening heading of text heroes. |
| H2 | EB Garamond 400 | 47 / 52 | Section headings, the closing newsletter heading. |
| H3 | EB Garamond 400 | 29 / 35 | Card titles, rate card prices, description headings, table row names. |
| Statement | EB Garamond 400 | 35 / 44 | Centred statements, callouts, the quote and the introduction. |
| Lede | Roboto 400 | 22 / 32 | Opening paragraphs and fact values. |
| Body | Roboto 400 | 18 / 30 | Text. |
| Body emphasis | Roboto 500 | 18 / 30 | Price lines, dates, run-in terms, the quote's author. |
| Small | Roboto 400 | 15 / 24 | Card text, rate card text, map key. |
| Term | Roboto 500 | 15 / 24 | The term of a fact or amenity, table heads. Sentence case. |
| Label | Roboto 600, tracked capitals | 13 / 18 | Only where a label names what follows: the rate card ("Price", "What it costs"), offer tags, the newsletter label. |
| Button | Roboto 500, capitals | 13 | Buttons and text links. |

On 28 pages at 1440 this gives 11 text styles; the frames had 20. Body text grows to about 20px on a 2000px screen. Lines stay under 62 characters (`--measure`).

### Grid and spacing

- **Grid:** 12 columns at every width. The outer margin `--edge` is `max(5.55vw clamped 20–104px, centring at 1680px)`. The gutter runs from 16 to 32px.
- **Section rhythm:**
  - `--section` (64–128px, 106 at 1440) between two sections' content. Each section has half of it above and below.
  - Bands use `--section-band` (56–112px) inside.
  - Two bands of one tone in a row share their padding.
  - The first section after an opener gets the full step.
- **Stack gaps:** `--s1`…`--s9`, 4–96px on an 8px base.
- **Panels:** every panel (rate card, callout, overlay panel) has the same padding, `--panel-pad`, 24–48px. Panels start on a column line.

Text starts only on column lines, or one panel padding inside a panel that starts on a column line. At 1440 the edges are 80, 189, 297, 406, 515, 623, 732, 841, 949 and 1058, plus 236, 504, 780 and 997 inside panels. Tables and the centred map key keep their own alignment. The frames had 11 recurring edges and 25 stray ones.

### Shape, shadow, motion

- **Radii** (owner's reference 8, Legacy Blueprint): photographs 10px, controls 12px, panels and full-width photographs 18px.
- **One shadow:** `--shadow-panel`, under the overlay panel only.
- **Motion:**
  - Only user actions animate in step 1: hover, press, card photographs easing in by 3%, the gallery viewer.
  - Durations are 160, 320 and 700ms, with one ease.
  - `prefers-reduced-motion` sets them to zero.
  - Signature motion arrives in step 2.

## Surfaces

Bands change at a clean edge, never through a gradient.

| Band | Sections |
| --- | --- |
| White | Everything by default. |
| Beige | Card groups, and the heading or text hero that introduces them. Cards right after a text opener stay white. |
| Forest | Galleries, overlay photographs and the quote. |
| Night | The closing photograph, the newsletter and the footer. |

On 28 pages there are 37 beige and 19 forest sections; the frames had 6 beige and no dark band inside a page.

**Closing (owner's reference 13):**
- Every page except The Vessyl Presents ends on a full-width night photograph of the Dome, with no text over it.
- Over its last two header heights it fades into the footer colour.
- The newsletter sits below it on that colour, and the footer continues it.
- The Frequency Dome opens on that photograph, so it closes on the other night photograph.
- The Vessyl Presents keeps its events newsletter as a forest band in the middle of the page.

## Hero types

| Type | Pages | Composition |
| --- | --- | --- |
| Photograph | 01, 14, 15, 17–22, 26, 28 | An inset rounded photograph under the header. The title and the actions sit low on the left, over a dark gradient. Only a title and actions: no paragraph over a photograph. |
| Split | 03–05, 08–12, 23–25 | A beige inset panel. The title, lede and actions are on columns 1–5, the photograph on 7–12. On phones the photograph goes under the text at 4:5. Every opener with a paragraph uses this type. |
| Text | 02, 06, 07, 13, 16, 27 | A beige inset panel with a centred display heading and lede, for overviews and practical pages. |

The header takes the copper "paper" colours on split and text heroes. It stays white over photographs (`photo` in `src/lib/enhanced/site-data.json`).

## Components

- **Buttons:**
  - Primary: forest, radius 12, height 48.
  - Secondary: a text link with a chevron. This covers the second action of a pair and the frames' "Link arrow" buttons.
  - On photographs: the Legacy translucent gradient button (reference 9), forest at 60% at the bottom and 35% at the top, 75/50 on hover. It is also used on the closing newsletter.
  - States: hover, pressed (1px down), focus (2px copper outline, light on dark), disabled (45% opacity, no pointer).
- **Photographs:**
  - Three proportions: 4:5 portrait, 3:2 landscape, 21:9 panorama.
  - One proportion per group: cards in threes are 4:5; pairs and offers are 3:2; galleries and overlay photographs are 21:9 on desktop, 3:2 or 4:5 on phones.
  - Hero frames take the screen's height.
  - Each of the 97 photographs has an `alt` text that describes the picture; the four press logos keep their names.
- **Cards:** the photograph, then a title (H3), the price line, small text and a text link. Offer tags are copper pills.
- **Facts and amenities:**
  - Terms and values on the 12 columns: four to a row, three when the count divides by three, two for a pair.
  - Each fact has a rule above it.
  - Tablets show two to a row, phones two (and one for the three info blocks).
- **Rate card:** a beige panel on columns 9–12 with the only label of the section, a price (H3), small text and the primary button.
- **Overlay:**
  - A 21:9 photograph in a forest band.
  - A white panel overlaps its lower edge on columns 2–6 (or 7–11).
- **Callout:** a beige panel on columns 2–11 with a 4:5 portrait and a statement.
- **Events:** rows on the 12 columns: date 1–2, name 3–5, line 6–9, price 10–11, action 12. On phones the button sits beside the stacked lines.
- **Comparison table:** heads in the term style. On phones each row becomes a stacked card with its terms.
- **Newsletter states:**
  - An empty or incomplete address gives a message under the field. It names what to do, marks the field invalid and keeps focus there.
  - Typing clears the error.
  - A valid address says that subscriptions are not connected in this preview.
- **Card rails on phones:** groups of three cards scroll sideways with snap points. When nothing inside a rail can take focus, the rail itself takes keyboard focus.

## Responsive

The system has two breakpoints, 1023px (tablet) and 767px (phone). The 12-column grid stays; what changes per template is the number of columns each part spans.
- **Tablet:**
  - Splits go 6/6.
  - The rate card spans 5 columns.
  - Facts go two to a row.
  - Overlay photographs go 3:2.
  - Events stack their line and price under the name.
- **Phone:**
  - Everything stacks, with the photograph first in editorial splits.
  - Card threes become a rail.
  - Overlay photographs go 4:5, with the panel overlapping by 64px.
  - Galleries go 3:2.
  - The table becomes cards.

## Measured after step 1 (all 28 pages, 1440px)

| Measure | Frames (audit) | Step 1 |
| --- | --- | --- |
| Text styles | 20 | 11 |
| Recurring text left edges | 11, plus 25 stray | 10 column lines plus 4 panel offsets |
| "Hero text only" heights | 23 different | content-driven |
| Eyebrow labels | 250 (about 9 a page) | 24 (0–2 a page) |
| Photo proportions | 5 unrelated | 3 |
| Beige / dark bands inside pages | 6 / 0 | 37 / 19 |
| Controls labelled "Button" | 9 | 0 |
| Placeholders `[...]` in text | 390 | 390 (content, step 3) |
| Controls without destination | 314 | 302 (content, step 3) |
| Photographs used on several pages | 24 | 26 (content, step 3) |

QA for step 1:
- Layout was checked at 69 widths from 360 to 2560 in Chrome, WebKit and Firefox.
- axe ran at 1440, 768 and 375.
- The gallery, menu and newsletter states were tested.
- The copy block was checked in three engines.
- `npm run check` and `npm run build:pages` passed on a clean copy.
