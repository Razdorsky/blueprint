<script lang="ts">
  import {bp} from '../context.ts';
  import Text from '../components/Text.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'quote'}>} = $props();
  const {t} = bp();
</script>

<figure class="wrap quote">
  <blockquote>
    {#each block.text as paragraph}<Text text={paragraph} />{/each}
  </blockquote>
  <figcaption><span>{block.by}</span>{#if block.role}<span>{t(block.role)}</span>{/if}</figcaption>
</figure>
