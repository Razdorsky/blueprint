<script lang="ts">
  // The whole site as one index of eighteen chapters. Pointing at a chapter shows its picture.
  import {bp} from '../context.ts';
  import {content} from '../content/pages.ts';
  import {loop, photo} from '../media.ts';
  import {booking, groupPages, route, sitePages, type Group} from '../site.ts';
  import logo from '../assets/logo.svg?raw';
  const {t, page, locale} = bp();
  // i18n: ["Stay", "Experiences", "The property"]
  const groups: [Group, string][] = [['stay', 'Stay'], ['experiences', 'Experiences'], ['property', 'The property']];
  const preview = (slug: string) => {
    const hero = content[slug].blocks.find(block => block.type === 'hero');
    if (!hero || hero.type !== 'hero') return '';
    return 'photo' in hero.media ? photo(hero.media.photo).src : loop(hero.media.loop).poster;
  };
</script>

<dialog class="site-menu" id="site-menu" aria-label={t('Menu')} data-tone="night">
  <div class="menu-top">
    <a class="header-logo" href={route('', locale)} aria-label={t('The Vessyl, home')}>{@html logo}</a>
    <button type="button" class="menu-close" data-menu-close>{t('Close')}</button>
  </div>
  <div class="menu-body">
    <nav class="menu-index" aria-label={t('All pages')}>
      <a class="menu-home" href={route('', locale)} aria-current={page.index === 1 ? 'page' : undefined} data-preview="1"><span class="menu-n">01</span>{t('The Vessyl')}</a>
      {#each groups as [group, label] (group)}
        <div class="menu-group">
          <p class="menu-group-title">{t(label)}</p>
          <ul>
            {#each groupPages(group) as item (item.index)}
              <li><a href={route(item.slug, locale)} aria-current={item.index === page.index ? 'page' : undefined} data-preview={item.index}><span class="menu-n">{String(item.index).padStart(2, '0')}</span>{t(item.name)}</a></li>
            {/each}
          </ul>
        </div>
      {/each}
    </nav>
    <div class="menu-preview arch" aria-hidden="true">
      {#each sitePages as item (item.index)}
        <img class="menu-shot" class:active={item.index === page.index} data-shot={item.index} src={preview(item.slug)} alt="" loading="lazy" />
      {/each}
    </div>
  </div>
  <div class="menu-foot">
    <a class="button" href={booking} target="_blank" rel="noopener noreferrer">{t('Check availability')}</a>
    <a class="link" href={route('rates-and-offers', locale)}>{t('Rates and offers')}</a>
  </div>
</dialog>
