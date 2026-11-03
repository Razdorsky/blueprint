<script lang="ts">
  // The page opening. The photograph sits in an arch, the shape of the Dome; scrolling opens
  // the arch until the picture fills the screen. Nothing is written over the open picture.
  import {bp, rich} from '../context.ts';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';

  let {block}: {block: Extract<Block, {type: 'hero'}>} = $props();
  const {t} = bp();
  // The horizontal focus of the picture ("37% 50%" gives 37) is what the closed arch shows in its middle.
  let fx = $derived(parseFloat(block.media.focus || '50'));
</script>

<header class="hero" data-hero>
  <div class="hero-copy">
    <h1 class="hero-title" data-split>{@html rich(t(block.title))}</h1>
    {#if block.lede}<p class="hero-lede">{@html rich(t(block.lede))}</p>{/if}
    <Actions actions={block.actions} />
  </div>
  <div class="hero-arch" data-arch style:--fx={fx}>
    <div class="hero-media"><Picture media={block.media} eager sizes="(min-width: 900px) 100vw, 100vw" /></div>
  </div>
</header>
