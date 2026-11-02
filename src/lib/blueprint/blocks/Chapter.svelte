<script lang="ts">
  // A full-bleed picture that the next part of the page is written over.
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'chapter'}>} = $props();
</script>

<div class="chapter">
  <div class="chapter-media" data-depth><Picture media={block.media} /></div>
  <div class="wrap chapter-copy">
    <Text as="h2" text={block.title} class="h1" />
    {#each block.body || [] as paragraph}<Text text={paragraph} />{/each}
    <Actions actions={block.actions} />
  </div>
</div>
