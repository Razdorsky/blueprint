<script lang="ts">
  import {bp, rich} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'events'}>} = $props();
  const {t} = bp();
</script>

<div class="wrap events" class:pictured={block.media}>
  <div class="events-copy">
    <Text as="h2" text={block.title} class="h2" />
    {#each block.body || [] as paragraph}<Text text={paragraph} />{/each}
    <ol class="events-list">
      {#each block.items as event, index (index)}
        <li class="event">
          <span class="event-date">{@html rich(t(event.date))}</span>
          <span class="event-name">{@html rich(t(event.name))}</span>
          <span class="event-line">{@html rich(t(event.line))}</span>
          <span class="event-price">{@html rich(t(event.price))}</span>
          <Actions actions={[block.action]} />
        </li>
      {/each}
    </ol>
  </div>
  {#if block.media}<figure class="frame events-media" data-reveal><Picture media={block.media} sizes="(min-width: 900px) 32vw, 92vw" /></figure>{/if}
</div>
