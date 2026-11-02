# Figma edition adaptation

The editable source is Figma file `TUJWRVApGPYhc7CXhdJFNF`, Website 2.0 page `814:6489`: the supplied Home and 12 supplied inner-page frames. Original responses, native screenshots and original media remain exclusively in the external Vessyl raw-source bank. The generated `src/pages/p01.tsx`–`p13.tsx` are local presentation inputs prepared by the owner, with optimized `/media/` references.

`scripts/adapt-figma.py RAW_HTML PAGE_INDEX OUTPUT_HTML` reads React SSR HTML using Python's standard `html.parser`. It reconstructs semantic HTML from the actual source nodes, copy and image references. It does not render a page screenshot as a website, install a Tailwind runtime, mutate Figma or read another website repository. The same resulting fragment serves both editions. All edition-specific appearance is in CSS; the fragment contains no inline style attributes.

## Structure contract

- Exactly one `<!--SITE_HEADER-->`, `<!--SITE_NEWSLETTER-->` and `<!--SITE_FOOTER-->` marker per source page. The owner supplies functional shared shells. Page 13 uses the separately supplied green events newsletter and its own source text.
- Direct semantic sections use `data-role`: `photo-hero`, `text-hero`, `split`, `cards`, `overlay`, `gallery`, `copy`, `quote`, `facts`, `amenities`, `comparison`, `map`, `introduction`, `logos`, `callout`, `events`.
- Original source `data-name` / `data-node-id` identifiers remain on sections, cards and identifiable text/control nodes.
- Inner hooks include `data-part="hero-image|hero-copy|copy|heading|eyebrow|paragraph|highlight|media|actions|action|card-grid|card|facts|fact|rate|table-scroll|map-key|artwork|callout-panel|event|gallery-open"`.
- `split` has `data-variant="description|editorial"`, `data-layout="image-first|copy-first"`. Description sections retain their prose column and beige rate/cannot-decide column. Callout panels preserve the source image first and source copy second.
- Cards use `article > figure[data-part=media] + div[data-part=copy]`. Source experience cards use their actual titles as internal links; room cards retain supplied explicit CTA text. Adjacent primary/link controls remain grouped as `data-part=actions`.
- One real H1 per page. Display headings use H1/H2/H3 and `.c-heading`; long source Telugu prose retains paragraph semantics with `.display-prose`. Source eyebrow labels remain Roboto paragraphs. The owner may use `.c-heading` for branded vector text rendering while preserving semantic text.
- Room amenities are real `dl/dt/dd` pairs (12 items). Room comparison is a real table with header associations and mobile cell labels. Four events remain four separate event rows and preserve their editable placeholders.
- Gallery sections have `data-gallery`, real `img[data-gallery-image]`, and an accessible `button[data-gallery-open]`. The supplied gallery frame contains only one actual photograph per page; the adapter does not invent further slides. The owner supplies modal, swipe, keyboard and edge-click behavior.

## Source content and corrections

All intentional source placeholders remain visible, including bracketed rates, schedules, capacities, policies, descriptions, contact details, offers and visible generic `Button` controls. Unknown actions remain focusable `button[data-pending-link]` with a clear accessible label. No fabricated booking, event checkout, contact URL, newsletter submission or successful subscription is produced.

The following unambiguous corrections are applied, without revising the original archived sources:

| Source | Presentation correction |
| --- | --- |
| `STAY WE US` | `STAY WITH US` |
| `the frecuency dome` | `the frequency dome` |
| `May to NOvember` | `May to November` |
| `From [rate] a nigh` | `From [rate] a night` |
| `for guest staying with us` | `for guests staying with us` |
| `the lights goes` | `the light goes` |
| `book tHE TREEHOUSE` | `Book the Treehouse` |
| Treehouse / Glamping / For Two / Horses pages: pasted `about the villas` | `About the Treehouse` / `About the tents` / `About the experience` / `About the ride` |
| Glamping: `book this villa`, `The Villas Gallery` | `Book a tent`, `Glamping Tents Gallery` |
| Day/Half Day card: pasted `Four nights or more, [offer]` | `[offer]`, preserving its unprovided value |
| Home Dome section: pasted room CTA `SEE WHERE YOU WILL SLEEP` | `Explore the Dome`, linked to the supplied Frequency Experience page |
| For Two: the Dusk sentence copied to Dinner and The Dome | Dinner: `Dinner is included.`; Dome: `A private session in the Dome, just the two of you.` Both facts are already supplied on that same page; Dusk retains the grammatical correction only |

Shared-shell obvious spelling corrections are coordinated with the owner: `best time to visiting us` → `Best time to visit us`, `Whatsap Contact` → `WhatsApp Contact`, `Adress Info` → `Address Info`. Visible generic `Button` placeholders are preserved according to the user's latest instruction, superseding the earlier artifact-removal proposal.

## Links

Internal links use the owner's `__EDITION_ROOT__` marker and exact supplied `src/data/pages.json` slugs. Availability and room-booking CTAs use `__BOOKING_URL__`. `BOOK AN EXPERIENCE` leads to the supplied Experiences index. Experience booking/session/ride/night/event controls without supplied partner destinations stay explicitly pending. No route is invented for About Josh, retreat/group inquiries, table reservations, or the as-yet-unprovided visit pages.

## Responsive adaptation

The source provides 1440px desktop frames, without mobile frames. `src/figma.css` preserves their white pages, source copper labels, green actions, beige rate cards, photograph/copy section order, dark photographic panels, room-card proportions and serif hierarchy. All rules are scoped to `body[data-edition="figma"]`.

The responsive interpretation targets 360px and larger: one-column layouts below 760px; equal 16px text/photo alignment; content-driven heights; no fixed page-frame widths; wrapping actions; two-column compact facts/amenities; stacked labeled comparison rows; legible map keys below the entire aerial photo. On small screens an overlay's prose moves below its image so source copy is readable without hiding the photograph or clipping long placeholders. Desktop map labels retain their relative positions on the supplied aerial image. Reduced motion disables the local control transition; the owner governs all shared movement behavior.

## Verification scope

Adapter checks were run against rendered SSR for all 13 source pages: exactly one H1, one set of shared-shell markers, no empty controls, no inline edition styles, and identical occurrence counts for every bracketed source token after excluding the replaced shell nodes. The owner separately verifies shell copy/placeholders, media assets, routes, runtime interactions, typography rendering and responsive behavior in a browser for both editions. Source photographs repeated in Figma are retained; source statements of operational availability remain design copy rather than verified business facts.

## Final SvelteKit integration

The source fragments were converted into native `src/lib/pages/P01.svelte`–`P13.svelte`, with no runtime HTML injection. Shared shell components and client navigation use SvelteKit. Word-art spaces are explicit Svelte text expressions to preserve typography. Owner QA corrected inherited quote paragraph overrides, reserved card image ratios before lazy loading and kept the Presents newsletter at its source position. Blueprint desktop card groups use three columns, or two for a supplied two-card group. Native page content and placeholders are unchanged.
