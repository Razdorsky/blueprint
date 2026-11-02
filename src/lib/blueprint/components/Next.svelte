<script lang="ts">
  // The story continues: every page ends by opening the next one; the last returns to the first.
  import {bp} from '../context.ts';
  import Picture from './Picture.svelte';
  import {content} from '../content/pages.ts';
  import {next, route} from '../site.ts';
  const {t, page, locale} = bp();
  // i18n: ["Next", "Back to the beginning"]
  const following = next(page);
  const hero = content[following.slug].blocks.find(block => block.type === 'hero');
  // The close stays in the light the page ended in; the next page's picture shows what comes.
  const blocks = content[page.slug].blocks;
  const tone = blocks[blocks.length - 1].tone || 'paper';
</script>

<section class="b b-next" data-tone={tone}>
  <a class="next" href={route(following.slug, locale)} data-next>
    <span class="next-label">{t(following.index === 1 ? 'Back to the beginning' : 'Next')}<span class="next-count">{String(following.index).padStart(2, '0')}</span></span>
    <span class="next-title">{t(following.index === 1 ? 'The Vessyl' : following.name)}</span>
    {#if hero && hero.type === 'hero'}<span class="next-media arch"><Picture media={hero.media} sizes="(min-width: 900px) 24vw, 50vw" /></span>{/if}
  </a>
</section>
