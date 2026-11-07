<script lang="ts">
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
</script>

{#snippet languageButton()}
  <button type="button" class="language-trigger" data-language-trigger aria-label="Language: English">
    {#if edition === 'figma-enhanced'}
      <span>EN | ES</span>
    {:else}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18M5 7h14M5 17h14" />
      </svg>
      <span>EN</span>
    {/if}
  </button>
{/snippet}

{#snippet mega(list: typeof pages, title: string)}
  <details class="nav-group">
    <summary class="nav-trigger">{title}</summary>
    <div class="mega-menu">
      <a class="mega-overview" href={route(edition, list[0].slug, base)}><span>Overview ↗</span></a>
      {#each list.slice(1) as item (item.index)}
        <a href={route(edition, item.slug, base)}>
          <img src={asset(photo(item.index))} alt={item.name} loading="lazy" />
          <span>{item.name}</span>
        </a>
      {/each}
    </div>
  </details>
{/snippet}

<header class="site-header">
  <div class="header-inner">
    <button type="button" class="menu-toggle" data-menu-open aria-expanded="false" aria-haspopup="dialog" aria-controls="site-menu">
      <span class="menu-lines" aria-hidden="true"><i></i><i></i><i></i></span>
      <span>MENU</span>
    </button>
    <a class="brand" href={route(edition, '', base)} aria-label="Vessyl home">
      <img
        src={asset(`/brand/${page.photo ? 'logo-white.svg' : 'logo-copper.svg'}`)}
        width="210"
        height="39"
        alt="VESSYL"
      />
    </a>
    <nav class="desktop-navigation" aria-label="Main navigation">
      {@render mega(pages.slice(1, 6), 'Stay')}
      {@render mega([pages[6], ...pages.slice(7, 13)], 'Experiences')}
      <a href={route(edition, 'rates-and-offers', base)}>Rates &amp; offers</a>
    </nav>
    <div class="header-actions">
      {@render languageButton()}
      <a class="nav-book" href={booking} target="_blank" rel="noopener noreferrer">CHECK AVAILABILITY</a>
    </div>
  </div>
</header>
