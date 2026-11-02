<script lang="ts">
  import { booking, pages, route } from '#lib/site.ts';

  type Props = {
    edition: 'blueprint' | 'figma';
    page: { index: number; slug: string; name: string; photo: boolean };
    base?: string;
  };

  let { edition, base = '' }: Props = $props();

  const propertyLinks = ['The Dome', 'The Hearth', 'Sound and movement', 'Horses and land', 'The studio', 'The gallery'];
  const visitLinks = ['Getting here', 'Things to do in Arenal', 'When to visit', 'FAQ', 'Policies'];
  const contactLinks = ['WhatsApp Contact', 'Phone Contact', 'Address Info'];
</script>

{#snippet languageButton()}
  <button type="button" class="language-trigger" data-language-trigger aria-label="Language: English">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18M5 7h14M5 17h14" />
    </svg>
    <span>EN</span>
  </button>
{/snippet}

{#snippet pending(label: string)}
  <button type="button" data-pending-link={label}>{label}</button>
{/snippet}

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-top">
      <a class="brand" href={route(edition, '', base)}>
        <img src={`${base.replace(/\/$/, '')}/brand/logo-white.svg`} width="200" height="38" alt="VESSYL" />
      </a>
      <div class="header-actions">
        {@render languageButton()}
        <a class="nav-book" href={booking} target="_blank" rel="noopener noreferrer">CHECK AVAILABILITY</a>
      </div>
    </div>
    <div class="footer-columns">
      <section class="footer-group">
        <h2><a href={route(edition, 'where-you-sleep', base)}>Stay</a></h2>
        {#each pages.slice(2, 6) as item (item.index)}
          <a href={route(edition, item.slug, base)}>{item.name}</a>
        {/each}
      </section>
      <section class="footer-group">
        <h2><a href={route(edition, 'experiences', base)}>Experiences</a></h2>
        {#each pages.slice(7) as item (item.index)}
          <a href={route(edition, item.slug, base)}>{item.name}</a>
        {/each}
      </section>
      <section class="footer-group">
        <h2>The Property</h2>
        {#each propertyLinks as label (label)}{@render pending(label)}{/each}
      </section>
      <section class="footer-group">
        <h2>Plan your visit</h2>
        {#each visitLinks as label (label)}{@render pending(label)}{/each}
      </section>
      <section class="footer-group">
        <h2>Contact</h2>
        {#each contactLinks as label (label)}{@render pending(label)}{/each}
      </section>
    </div>
    <div class="footer-bottom">
      <p>© The Vessyl 2026 • La Fortuna, Costa Rica</p>
      <p>{@render pending('Privacy')} · {@render pending('Terms & Conditions')}</p>
    </div>
  </div>
</footer>
