<script lang="ts">
  import { booking, pages, route } from '#lib/blueprint/site.ts';

  type Props = {
    page: { index: number; slug: string; name: string; photo: boolean };
    base?: string;
  };

  let { base = '' }: Props = $props();
</script>

<dialog class="site-menu" id="site-menu" aria-label="Explore The Vessyl">
  <div class="menu-top">
    <a href={route('', base)}>
      <img src={`${base.replace(/\/$/, '')}/brand/logo-dark.svg`} alt="VESSYL" width="220" height="41" />
    </a>
    <button type="button" class="icon-button" data-menu-close aria-label="Close menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    </button>
  </div>
  <div class="menu-columns">
    <section class="menu-column">
      <h2>Where you sleep</h2>
      {#each pages.slice(1, 6) as item (item.index)}
        <a href={route(item.slug, base)}>{item.name}</a>
      {/each}
    </section>
    <section class="menu-column">
      <h2>Experiences</h2>
      {#each pages.slice(6) as item (item.index)}
        <a href={route(item.slug, base)}>{item.name}</a>
      {/each}
    </section>
  </div>
  <div class="menu-footer">
    <a class="nav-book" href={booking} target="_blank" rel="noopener noreferrer">CHECK AVAILABILITY ↗</a>
    <button type="button" class="language-trigger" data-language-trigger aria-label="Language: English">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18M5 7h14M5 17h14" />
      </svg>
      <span>EN</span>
    </button>
  </div>
  <div class="preview-toast dialog-toast" role="status" hidden></div>
</dialog>
