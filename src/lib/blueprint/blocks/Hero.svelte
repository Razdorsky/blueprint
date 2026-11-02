<script lang="ts">
  // The page opening. The photograph sits in an arch, the shape of the Dome; scrolling opens
  // the arch until the picture fills the screen. The chapter number places the page in the story.
  import {bp, rich} from '../context.ts';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import {route, sitePages} from '../site.ts';
  import type {Block} from '../content/types.ts';

  let {block}: {block: Extract<Block, {type: 'hero'}>} = $props();
  const {t, page, locale} = bp();
  // i18n: ["The Vessyl", "Stay", "Experiences", "The property"]
  const groupLabel: Record<string, string> = {home: 'The Vessyl', stay: 'Stay', experiences: 'Experiences', property: 'The property'};
  const groupHome: Record<string, string> = {home: '', stay: 'where-you-sleep', experiences: 'experiences', property: 'the-frequency-dome'};
</script>

<header class="hero" data-hero>
  <div class="hero-copy">
    <p class="hero-mark">
      <span class="hero-count"><span>{String(page.index).padStart(2, '0')}</span><span aria-hidden="true">/</span><span>{sitePages.length}</span></span>
      {#if page.index === 1}<span>{t('Arenal, Costa Rica')}</span>{:else}<a href={route(groupHome[page.group], locale)}>{t(groupLabel[page.group])}</a>{/if}
    </p>
    <h1 class="hero-title" data-split>{@html rich(t(block.title))}</h1>
    {#if block.lede}<p class="hero-lede">{@html rich(t(block.lede))}</p>{/if}
    <Actions actions={block.actions} />
  </div>
  <div class="hero-arch" data-arch>
    <div class="hero-media"><Picture media={block.media} eager sizes="(min-width: 900px) 100vw, 100vw" /></div>
  </div>
</header>
