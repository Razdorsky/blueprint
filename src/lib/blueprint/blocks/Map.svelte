<script lang="ts">
  import {bp} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'map'}>} = $props();
  const {t} = bp();
</script>

<div class="wrap map">
  <div class="map-copy">
    <Text as="h2" text={block.title} class="h2" />
    {#each block.body || [] as paragraph}<Text text={paragraph} />{/each}
    <ul class="map-legend">{#each block.items as item}<li>{t(item)}</li>{/each}</ul>
  </div>
  <div class="map-media frame"><Picture media={block.media} sizes="(min-width: 900px) 60vw, 100vw" /></div>
</div>
