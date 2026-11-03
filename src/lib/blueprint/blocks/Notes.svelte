<script lang="ts">
  // Things to know before booking, set plainly beside a picture.
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'notes'}>} = $props();
</script>

<div class="wrap notes" class:pictured={block.media}>
  {#if block.media}<figure class="frame notes-media" data-reveal><Picture media={block.media} sizes="(min-width: 900px) 36vw, 92vw" ratio={0.8} /></figure>{/if}
  <div class="notes-copy">
    <Text as="h2" text={block.title} class="h2" />
    <div class="notes-list" class:single={block.items.length === 1}>
      {#each block.items as note, index (index)}
        <div class="note">
          {#if note.title}<Text as="h3" text={note.title} class="h3" />{/if}
          <Text text={note.text} />
        </div>
      {/each}
    </div>
    <Actions actions={block.actions} />
  </div>
</div>
