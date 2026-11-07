<script lang="ts">
  // The land in one scene: a short title holds the middle of the screen while photographs of
  // the property drift past it at two depths. Each picture opens the page it belongs to.
  // No picture outranks another (Brand Bible: "No portal outranks another").
  import {bp, rich} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'land'}>} = $props();
  const {t, href} = bp();
  // Depth of each place in the drift: below 1 is farther away, above 1 nearer. The first and last
  // rows are nearer, so they never drift out of the scene into its neighbours.
  const depth = [1.2, 1.2, 0.8, 0.8, 1.2, 1.2];
</script>

<div class="land" data-land>
  <div class="land-head">
    <div class="land-head-inner">
      <Text as="h2" text={block.title} class="h2" />
      {#if block.body}<Text text={block.body} class="land-body" />{/if}
    </div>
  </div>
  <ul class="land-items">
    {#each block.items as item, index (item.caption)}
      {@const url = item.to ? href(item.to) : null}
      <li class="land-item" data-depth-layer={depth[index % depth.length]}>
        <svelte:element this={url ? 'a' : 'div'} class="land-link" href={url || undefined}>
          <span class="frame land-frame" data-reveal><Picture media={item.media} sizes="(min-width: 900px) 26vw, 46vw" /></span>
          <span class="land-caption">{@html rich(t(item.caption))}</span>
        </svelte:element>
      </li>
    {/each}
  </ul>
</div>
