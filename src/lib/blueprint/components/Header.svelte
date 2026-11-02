<script lang="ts">
  // The header floats over the page, takes the colour of the light beneath it, and steps aside
  // while you read downwards. The language switch keeps your place on the page.
  import {bp} from '../context.ts';
  import {booking, route} from '../site.ts';
  import logo from '../assets/logo.svg?raw';
  const {t, page, locale} = bp();
</script>

<header class="site-header" data-header>
  <div class="header-inner">
    <button type="button" class="menu-button" data-menu-open aria-expanded="false" aria-controls="site-menu">
      <span class="menu-icon" aria-hidden="true"><i></i><i></i></span><span>{t('Menu')}</span>
    </button>
    <a class="header-logo" href={route('', locale)} aria-label={t('The Vessyl, home')}>{@html logo}</a>
    <div class="header-end">
      <nav class="language" aria-label={t('Language')}>
        <a href={route(page.slug, 'en')} hreflang="en" lang="en" aria-current={locale === 'en' ? 'true' : undefined} data-locale="en">EN</a>
        <a href={route(page.slug, 'es')} hreflang="es" lang="es" aria-current={locale === 'es' ? 'true' : undefined} data-locale="es">ES</a>
      </nav>
      <a class="button header-book" href={booking} target="_blank" rel="noopener noreferrer">{t('Check availability')}</a>
    </div>
  </div>
  <span class="progress" aria-hidden="true" data-progress></span>
</header>
