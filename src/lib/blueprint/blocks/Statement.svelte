<script lang="ts">
  // One large sentence set as the page's voice; it brightens word by word as it is read.
  import Text from '../components/Text.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'statement'}>} = $props();
</script>

<div class="wrap statement">
  <Text text={block.text} class="statement-text" />
  {#each block.body || [] as paragraph}<Text text={paragraph} class="statement-body" />{/each}
  <Actions actions={block.actions} />
</div>
