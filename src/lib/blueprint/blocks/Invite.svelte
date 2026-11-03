<script lang="ts">
  // The page's invitation at the top of its first sheet: the brand's own line, set large in the
  // italic, beside what the place is and the two ways in.
  import {bp, rich} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'invite'}>} = $props();
  const {t} = bp();
</script>

<div class="wrap invite">
  <h1 class="invite-title">{@html rich(t(block.title))}</h1>
  <div class="invite-side">
    <Text text={block.body} class="invite-body" />
    <Actions actions={block.actions} />
  </div>
</div>
