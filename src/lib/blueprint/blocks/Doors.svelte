<script lang="ts">
  // Doors into other pages or offers, each under an arch. On wide screens a rail can be
  // walked sideways by scrolling; on phones it is a row you swipe.
  import {bp, rich} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'doors'}>} = $props();
  const {t, href} = bp();
</script>

<div class="doors" class:rail={block.rail} data-rail={block.rail ? '' : undefined}>
  {#if block.title || block.body}
    <div class="wrap doors-head">
      {#if block.title}<Text as="h2" text={block.title} class="h2" />{/if}
      {#each block.body || [] as paragraph}<Text text={paragraph} class="doors-intro" />{/each}
    </div>
  {/if}
  <div class="doors-track" data-track>
    <ul class="doors-list" style:--count={block.items.length}>
      {#each block.items as door (door.title)}
        {@const url = href(door.to)}
        <li class="door">
          <svelte:element this={url ? 'a' : 'button'} class="door-link" href={url || undefined} type={url ? undefined : 'button'} data-pending={url ? undefined : ''}
            target={door.to === 'booking' ? '_blank' : undefined} rel={door.to === 'booking' ? 'noopener noreferrer' : undefined}>
            <span class="door-media arch"><Picture media={door.media} sizes="(min-width: 900px) 30vw, 80vw" /></span>
            <span class="door-title">{@html rich(t(door.title))}</span>
            {#if door.meta}<span class="door-meta">{@html rich(t(door.meta))}</span>{/if}
            <span class="door-text">{@html rich(t(door.text))}</span>
            {#if door.action}<span class="door-action">{t(door.action)}</span>{/if}
          </svelte:element>
        </li>
      {/each}
    </ul>
  </div>
  {#if block.actions}<div class="wrap"><Actions actions={block.actions} /></div>{/if}
</div>
