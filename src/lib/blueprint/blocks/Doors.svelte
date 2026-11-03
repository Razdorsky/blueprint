<script lang="ts">
  // Doors into other pages or offers, upright, or wide when there are two. On wide
  // screens a rail is walked sideways by scrolling and opens with its own introduction; on
  // phones it is a row you swipe.
  import {bp, rich} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'doors'}>} = $props();
  const {t, href} = bp();
  let intro = $derived(Boolean(block.title || block.body));
</script>

{#snippet head()}
  {#if block.title}<Text as="h2" text={block.title} class="h2" />{/if}
  {#each block.body || [] as paragraph}<Text text={paragraph} class="doors-intro" />{/each}
{/snippet}

<div class="doors" class:rail={block.rail} class:wide={block.wide} data-rail={block.rail ? '' : undefined}>
  <!-- A rail on wide screens carries its introduction as the first panel; elsewhere it sits above. -->
  {#if intro}<div class="wrap doors-head">{@render head()}</div>{/if}
  <div class="doors-track" data-track>
    <ul class="doors-list" style:--count={block.items.length}>
      {#if intro && block.rail}
        <li class="door door-lead">{@render head()}<Actions actions={block.actions} /></li>
      {/if}
      {#each block.items as door (door.title)}
        {@const url = href(door.to)}
        <li class="door">
          <svelte:element this={url ? 'a' : 'button'} class="door-link" href={url || undefined} type={url ? undefined : 'button'} data-pending={url ? undefined : ''}
            target={door.to === 'booking' ? '_blank' : undefined} rel={door.to === 'booking' ? 'noopener noreferrer' : undefined}>
            <span class="frame door-media" data-reveal><Picture media={door.media} sizes={block.wide ? '(min-width: 900px) 46vw, 92vw' : '(min-width: 900px) 30vw, 80vw'} ratio={block.wide ? 1.5 : 0.8} /></span>
            <span class="door-title">{@html rich(t(door.title))}</span>
            {#if door.meta}<span class="door-meta">{@html rich(t(door.meta))}</span>{/if}
            <span class="door-text">{@html rich(t(door.text))}</span>
            {#if door.action}<span class="door-action">{t(door.action)}</span>{/if}
          </svelte:element>
        </li>
      {/each}
    </ul>
  </div>
  {#if block.actions && !block.rail}<div class="wrap"><Actions actions={block.actions} /></div>{/if}
  {#if block.actions && block.rail}<div class="wrap doors-after"><Actions actions={block.actions} /></div>{/if}
</div>
