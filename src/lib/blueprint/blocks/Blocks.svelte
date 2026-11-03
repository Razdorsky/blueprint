<script lang="ts">
  // Renders a page's scenes. Each scene declares the light it sits in (data-tone). Where the
  // light changes, it changes at a clean edge: a picture or the nightfall arch carries it.
  import type {Block} from '../content/types.ts';
  import Hero from './Hero.svelte';
  import Split from './Split.svelte';
  import Doors from './Doors.svelte';
  import Facts from './Facts.svelte';
  import Steps from './Steps.svelte';
  import Gallery from './Gallery.svelte';
  import Film from './Film.svelte';
  import Table from './Table.svelte';
  import Events from './Events.svelte';
  import Map from './Map.svelte';
  import Notes from './Notes.svelte';
  import Newsletter from './Newsletter.svelte';
  import Land from './Land.svelte';
  import Stay from './Stay.svelte';
  import Nightfall from './Nightfall.svelte';
  import Projection from './Projection.svelte';
  import Voices from './Voices.svelte';

  let {blocks}: {blocks: Block[]} = $props();
  const views: Record<string, any> = {
    split: Split, doors: Doors, facts: Facts, steps: Steps, gallery: Gallery, film: Film,
    table: Table, events: Events, map: Map, notes: Notes,
    land: Land, stay: Stay, nightfall: Nightfall, projection: Projection, voices: Voices
  };
  const tone = (index: number) => blocks[index]?.tone || 'paper';
</script>

{#each blocks as block, index (index)}
  {#if block.type === 'hero'}
    <section class="b b-hero" data-tone={tone(index)}><Hero {block} /></section>
  {:else if block.type === 'newsletter'}
    <section class="b b-newsletter" data-tone={tone(index)}><Newsletter variant={block.variant} /></section>
  {:else}
    {@const View = views[block.type]}
    <section class="b b-{block.type}" data-tone={tone(index)} id={block.id}><View {block} /></section>
  {/if}
{/each}
