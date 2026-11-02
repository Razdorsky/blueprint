<script lang="ts">
  // The practical part: price line, booking, and the facts as a list of terms.
  import {bp, rich} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'facts'}>} = $props();
  const {t} = bp();
</script>

<div class="wrap facts">
  <div class="facts-lead">
    <Text as="h2" text={block.title} class="h2" />
    {#each block.body || [] as paragraph}<Text text={paragraph} />{/each}
    <Actions actions={block.actions} />
  </div>
  <dl class="facts-list">
    {#each block.items as [term, value] (term)}
      <div><dt>{t(term)}</dt><dd>{@html rich(t(value))}</dd></div>
    {/each}
  </dl>
</div>
