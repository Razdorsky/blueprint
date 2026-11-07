<script lang="ts">
  // Picture and text side by side; an optional small picture overlaps.
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import {photo} from '../media.ts';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'split'}>} = $props();
  let portrait = $derived('photo' in block.media && photo(block.media.photo).h > photo(block.media.photo).w);
</script>

<div class="wrap split" class:flip={block.flip} class:portrait>
  <figure class="split-media">
    <div class="frame" data-depth><Picture media={block.media} sizes="(min-width: 900px) 50vw, 100vw" /></div>
    {#if block.aside}<div class="split-aside frame"><Picture media={block.aside} sizes="(min-width: 900px) 18vw, 40vw" /></div>{/if}
  </figure>
  <div class="split-copy">
    {#if block.title}<Text as="h2" text={block.title} class="h2" />{/if}
    {#each block.body as paragraph}<Text text={paragraph} />{/each}
    <Actions actions={block.actions} />
  </div>
</div>
