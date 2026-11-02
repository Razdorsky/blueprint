<script lang="ts">
  // Renders a page's blocks. Each block declares the light it sits in (data-tone). Where the
  // light changes, the top of the next block carries a long gradient from the previous ground,
  // so a page moves from day into night the way the property does.
  import {ground} from '../site.ts';
  import type {Block} from '../content/types.ts';
  import Hero from './Hero.svelte';
  import Statement from './Statement.svelte';
  import Split from './Split.svelte';
  import Chapter from './Chapter.svelte';
  import Doors from './Doors.svelte';
  import Facts from './Facts.svelte';
  import Steps from './Steps.svelte';
  import Gallery from './Gallery.svelte';
  import Film from './Film.svelte';
  import Quote from './Quote.svelte';
  import Founder from './Founder.svelte';
  import Press from './Press.svelte';
  import Table from './Table.svelte';
  import Events from './Events.svelte';
  import Map from './Map.svelte';
  import Notes from './Notes.svelte';
  import Newsletter from './Newsletter.svelte';

  let {blocks}: {blocks: Block[]} = $props();
  const views: Record<string, any> = {statement: Statement, split: Split, chapter: Chapter, doors: Doors, facts: Facts, steps: Steps, gallery: Gallery, film: Film, quote: Quote, founder: Founder, press: Press, table: Table, events: Events, map: Map, notes: Notes};
  const tone = (index: number) => blocks[index]?.tone || 'paper';
  const from = (index: number) => (index > 0 && tone(index - 1) !== tone(index) ? ground(tone(index - 1)) : undefined);
</script>

{#each blocks as block, index (index)}
  {#if block.type === 'hero'}
    <section class="b b-hero" data-tone={tone(index)}><Hero {block} /></section>
  {:else if block.type === 'newsletter'}
    <section class="b b-newsletter" data-tone={tone(index)} style:--from={from(index)} class:dusk={from(index)}><Newsletter variant={block.variant} /></section>
  {:else}
    {@const View = views[block.type]}
    <section class="b b-{block.type}" data-tone={tone(index)} id={block.id} style:--from={from(index)} class:dusk={from(index)}><View {block} /></section>
  {/if}
{/each}
