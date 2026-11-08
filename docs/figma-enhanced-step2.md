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
