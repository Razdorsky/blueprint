<script lang="ts">
  // Step 2.1 (docs/figma-enhanced-step2.md): the designer's header, floating as on /blueprint/ 452c7d0, with the
  // Legacy Blueprint mega menu for Where you sleep and Experiences. Behaviour lives in interactions.js.
  import { booking, pages, photo, route } from '#lib/enhanced/site.ts';

  type Props = {
    edition: 'figma-enhanced';
    page: { index: number; slug: string; name: string; photo: boolean };
    base?: string;
  };

  let { edition, page, base = '' }: Props = $props();

  function asset(path: string) {
    if (/^(?:https?:)?\/\//.test(path)) return path;
    return `${base.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  // Each card shows the photograph that opens its page (Glamping Tents shares the Villas' opener, so it shows a
  // tent; Rates and offers opens on text, so it shows its own first photograph).
  const cover: Record<number, string> = {
    3: '2b61d0b9909a48665218', 4: '38bd44acd09f7a1caa67', 5: '1cf43cba02fcc0f90ae8', 6: '53aa5ba8e622d63f0ff1',
    8: 'f5ec5ec1897cef56ade3', 9: 'a32b1d05d2deb9142826', 10: '217d8eafeb5342a6cc73', 11: '52f6dfa2f4537874ca20',
    12: 'ea5d3eb36b2031e294f0', 13: 'df44479df6d2cfd7b1f9'
  };
  const image = (index: number) => (cover[index] ? `/media/${cover[index]}.webp` : photo(index));

  // Overview pages 02 and 07, and the pages under them.
  const groups = [
    { id: 'stay', title: 'Where you sleep', overview: pages[1], items: pages.slice(2, 6) },
    { id: 'experiences', title: 'Experiences', overview: pages[6], items: pages.slice(7, 13) }
  ];
</script>

<header class="site-header" data-header data-theme={page.photo ? 'dark' : 'light'}>
  <div class="header-inner">
    <div class="header-start">
      <button type="button" class="menu-toggle" data-menu-open aria-expanded="false" aria-haspopup="dialog" aria-controls="site-menu">
        <span class="menu-lines" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>MENU</span>
      </button>
      <nav class="header-nav" aria-label="Main navigation">
        {#each groups as group (group.id)}
          <button type="button" class="nav-trigger" data-mega-trigger aria-expanded="false" aria-controls={`mega-${group.id}`}>
            <span>{group.title}</span>
            <svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
          </button>
        {/each}
      </nav>
    </div>
    <a class="brand" href={route(edition, '', base)} aria-label="Vessyl home">
      <img class="logo-light" src={asset('/brand/logo-white.svg')} width="210" height="39" alt="" />
      <img class="logo-copper" src={asset('/brand/logo-copper.svg')} width="210" height="39" alt="" />
    </a>
    <div class="header-actions">
      <button type="button" class="language-trigger" data-language-trigger aria-label="Language: English">
        <span>EN | ES</span>
      </button>
      <a class="nav-book" href={booking} target="_blank" rel="noopener noreferrer">CHECK AVAILABILITY</a>
    </div>
  </div>
  {#each groups as group (group.id)}
    <nav id={`mega-${group.id}`} class="mega" data-mega data-open="false" aria-label={group.title} data-lenis-prevent inert>
      <div class="mega-cards" style={`--count: ${group.items.length}`}>
        {#each group.items as item (item.index)}
          <a class="mega-card" href={route(edition, item.slug, base)}>
            <span class="mega-image"><img src={asset(image(item.index))} alt="" loading="lazy" decoding="async" /></span>
            <span class="mega-label">{item.name}</span>
          </a>
        {/each}
      </div>
      <a class="mega-overview" href={route(edition, group.overview.slug, base)}>
        <span>Overview</span>
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 10 10 2M2 2h8v8" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
      </a>
    </nav>
  {/each}
  <span class="header-progress" aria-hidden="true"></span>
</header>
