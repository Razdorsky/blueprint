<script lang="ts">
  import {bp, rich} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'table'}>} = $props();
  const {t} = bp();
</script>

<div class="wrap table-block" class:pictured={block.media}>
  <div class="table-copy">
    <Text as="h2" text={block.title} class="h2" />
    {#each block.body || [] as paragraph}<Text text={paragraph} />{/each}
    <div class="table-scroll">
      <table>
        <thead><tr>{#each block.head as cell}<th scope="col">{t(cell)}</th>{/each}</tr></thead>
        <tbody>
          {#each block.rows as row, index (index)}
            <tr>{#each row as cell, column}{#if column === 0}<th scope="row">{@html rich(t(cell))}</th>{:else}<td data-label={t(block.head[column])}>{@html rich(t(cell))}</td>{/if}{/each}</tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  {#if block.media}<figure class="frame table-media" data-reveal><Picture media={block.media} sizes="(min-width: 900px) 32vw, 92vw" ratio={0.8} /></figure>{/if}
</div>
