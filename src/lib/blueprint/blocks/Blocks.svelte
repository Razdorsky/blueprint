<script lang="ts">
  // Renders a page's scenes. Each scene declares the light it sits in (data-tone). Where the
  // light changes, it changes at a clean edge: a picture or the nightfall arch carries it.
  // A page told in places opens onto the fixed stage between sheets: a stage block makes an
  // opening, and the blocks after it, up to the next opening, ride on one sheet.
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
  import Stay from './Stay.svelte';
  import Nightfall from './Nightfall.svelte';
  import Projection from './Projection.svelte';
  import Voices from './Voices.svelte';
  import Invite from './Invite.svelte';
  import Places from './Places.svelte';
  import Opener from './Opener.svelte';
  import Stage from '../components/Stage.svelte';

  let {blocks}: {blocks: Block[]} = $props();
  const views: Record<string, any> = {
    split: Split, doors: Doors, facts: Facts, steps: Steps, gallery: Gallery, film: Film,
    table: Table, events: Events, map: Map, notes: Notes,
    stay: Stay, nightfall: Nightfall, projection: Projection, voices: Voices,
    invite: Invite, places: Places
  };
  const tone = (index: number) => blocks[index]?.tone || 'paper';
  type Opening = Extract<Block, {type: 'stage'}>;
  type Group = {opener: Opening} | {sheet: {block: Block; index: number}[]; tone: string};
  const group = (list: Block[]) => {
    const groups: Group[] = [];
    list.forEach((block, index) => {
      if (block.type === 'stage') return void groups.push({opener: block});
      const last = groups[groups.length - 1];
      if (last && 'sheet' in last) last.sheet.push({block, index});
      else groups.push({sheet: [{block, index}], tone: list[index].tone || 'paper'});
    });
    return groups;
  };
  let groups = $derived(group(blocks));
  let names = $derived(blocks.flatMap(block => (block.type === 'stage' ? [block.place] : [])));
</script>

{#snippet scene(block: Block, index: number)}
  {#if block.type === 'hero'}
    <section class="b b-hero" data-tone={tone(index)}><Hero {block} /></section>
  {:else if block.type === 'newsletter'}
    <section class="b b-newsletter" data-tone={tone(index)}><Newsletter variant={block.variant} /></section>
  {:else}
    {@const View = views[block.type]}
    <section class="b b-{block.type}" data-tone={tone(index)} id={block.id}><View {block} /></section>
  {/if}
{/snippet}

{#if names.length}
  <Stage {names} />
  {#each groups as group, g (g)}
    {#if 'opener' in group}
      <Opener block={group.opener} first={g === 0} />
    {:else}
      <div class="sheet" data-tone={group.tone}>
        {#each group.sheet as {block, index} (index)}{@render scene(block, index)}{/each}
      </div>
    {/if}
  {/each}
{:else}
  {#each blocks as block, index (index)}{@render scene(block, index)}{/each}
{/if}
