<script lang="ts">
  // The open door at the end of every page: the next page's own opening picture, large, with
  // its name and one line of what is there. The arch opens as it comes into view, the way the
  // next page's opening does, so the click continues the same movement.
  import {bp, rich} from '../context.ts';
  import Picture from './Picture.svelte';
  import {content} from '../content/pages.ts';
  import {next, route} from '../site.ts';
  const {t, page, locale} = bp();
  const following = next(page);
  const target = content[following.slug];
  const hero = target.blocks.find(block => block.type === 'hero');
  // The close stays in the light the page ended in.
  const blocks = content[page.slug].blocks;
  const tone = blocks[blocks.length - 1].tone || 'paper';
</script>

<section class="b b-next" data-tone={tone}>
  <a class="next" href={route(following.slug, locale)} data-next>
    <span class="wrap next-head">
      <span class="next-title">{t(following.index === 1 ? 'The Vessyl' : following.name)}</span>
      <span class="next-line">{@html rich(t(target.description))}</span>
    </span>
    {#if hero && hero.type === 'hero'}
      <span class="wrap next-frame"><span class="next-media" data-next-arch><Picture media={hero.media} sizes="100vw" /></span></span>
    {/if}
  </a>
</section>
