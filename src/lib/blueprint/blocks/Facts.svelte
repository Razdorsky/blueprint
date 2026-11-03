<script lang="ts">
  // The practical part: price line, booking, and the facts as a list of terms, beside a picture
  // that stays in view while the list is read.
  import {bp, rich} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'facts'}>} = $props();
  const {t} = bp();
</script>

<div class="wrap facts" class:pictured={block.media}>
  <div class="facts-lead">
    <Text as="h2" text={block.title} class="h2" />
    {#each block.body || [] as paragraph}<Text text={paragraph} />{/each}
    <Actions actions={block.actions} />
  </div>
  <dl class="facts-list">
    {#each block.items as [term, value] (term)}
      <div><dt>{t(term)}</dt><dd>{@html rich(t(value))}</dd></div>
    {/each}
  </dl>
  {#if block.media}<figure class="frame facts-media" data-reveal><Picture media={block.media} sizes="(min-width: 900px) 36vw, 92vw" /></figure>{/if}
</div>
