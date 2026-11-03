<script lang="ts">
  // The close of every page: the brand's own invitation beside the Dome under the night sky,
  // the index again, and the newsletter.
  import {bp, rich} from '../context.ts';
  import Newsletter from '../blocks/Newsletter.svelte';
  import Picture from './Picture.svelte';
  import {booking, groupPages, route, type Group} from '../site.ts';
  import symbol from '../assets/symbol.svg?raw';
  const {t, page, locale} = bp();
  const groups: [Group, string][] = [['stay', 'Stay'], ['experiences', 'Experiences'], ['property', 'The property']];
  const visit = ['Getting here', 'Things to do in Arenal', 'When to visit', 'Questions', 'Policies'];
  const contact = ['WhatsApp', 'Phone', 'Address'];
  // i18n: ["Stay", "Experiences", "The property", "Getting here", "Things to do in Arenal", "When to visit", "Questions", "Policies", "WhatsApp", "Phone", "Address"]
</script>

<footer class="site-footer" data-tone="night">
  <Newsletter variant={page.slug === 'the-vessyl-presents' ? 'events' : undefined} />
  <div class="wrap footer-close">
    <div class="footer-invite">
      <p class="footer-line">{@html rich(t('Come for Costa Rica.\nCome for the horses.\nCome for the volcano.'))}<br />{t('Just come curious.')}</p>
      <a class="button" href={booking} target="_blank" rel="noopener noreferrer">{t('Check availability')}</a>
    </div>
    <figure class="frame footer-night" data-reveal><Picture media={{loop: 'stars', alt: 'The Frequency Dome under the Milky Way'}} sizes="(min-width: 900px) 46vw, 92vw" /></figure>
  </div>
  <div class="wrap footer-columns">
    {#each groups as [group, label] (group)}
      <nav aria-label={t(label)}>
        <h2>{t(label)}</h2>
        <ul>{#each groupPages(group) as item (item.index)}<li><a href={route(item.slug, locale)}>{t(item.name)}</a></li>{/each}</ul>
      </nav>
    {/each}
    <div>
      <h2>{t('Plan your visit')}</h2>
      <ul>{#each visit as label}<li><button type="button" data-pending>{t(label)}</button></li>{/each}</ul>
    </div>
    <div>
      <h2>{t('Contact')}</h2>
      <ul>{#each contact as label}<li><button type="button" data-pending>{t(label)}</button></li>{/each}</ul>
    </div>
  </div>
  <div class="wrap footer-base">
    <span class="footer-seal" aria-hidden="true">{@html symbol}</span>
    <p>© The Vessyl 2026. {t('La Fortuna, Costa Rica')}</p>
    <p><button type="button" data-pending>{t('Privacy')}</button> <button type="button" data-pending>{t('Terms and conditions')}</button></p>
  </div>
</footer>
