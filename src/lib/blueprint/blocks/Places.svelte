<script lang="ts">
  // The parts of the land in one row of equal pictures, each opening its page.
  import {bp, rich} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'places'}>} = $props();
  const {t, href} = bp();
</script>

<div class="wrap places">
  <div class="places-head">
    <Text as="h2" text={block.title} class="h1 places-title" />
    {#if block.body}<Text text={block.body} class="places-body" />{/if}
  </div>
  <ul class="places-list">
    {#each block.items as item (item.caption)}
      {@const url = item.to ? href(item.to) : null}
      <li>
        <svelte:element this={url ? 'a' : 'div'} class="place" href={url || undefined}>
          <span class="frame place-frame" data-reveal><Picture media={item.media} sizes="(min-width: 900px) 24vw, 46vw" ratio={0.8} /></span>
          <span class="place-caption">{@html rich(t(item.caption))}{#if url}<span class="place-go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4.5 12h14.5M13 6l6 6-6 6" /></svg></span>{/if}</span>
        </svelte:element>
      </li>
    {/each}
  </ul>
</div>
