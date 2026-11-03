<script lang="ts">
  // The ways to stay as three equal doors under their introduction. One group, one shape.
  import {bp, rich} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'stay'}>} = $props();
  const {t, href} = bp();
</script>

<div class="wrap stay">
  <div class="stay-head">
    <Text as="h2" text={block.title} class="h1" />
    {#each block.body as paragraph}<Text text={paragraph} />{/each}
    <Actions actions={block.actions} />
  </div>
  <ul class="stay-doors">
    {#each block.items as door (door.title)}
      {@const url = href(door.to)}
      <li class="stay-door">
        <a class="stay-link" href={url}>
          <span class="frame stay-frame" data-reveal>
            <Picture media={door.media} sizes="(min-width: 900px) 30vw, 92vw" ratio={0.8} />
          </span>
          <span class="stay-title">{@html rich(t(door.title))}</span>
          <span class="stay-text">{@html rich(t(door.text))}</span>
          {#if door.action}<span class="stay-action">{t(door.action)}</span>{/if}
        </a>
      </li>
    {/each}
  </ul>
</div>
