<script lang="ts">
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'founder'}>} = $props();
</script>

<div class="wrap founder">
  <div class="founder-media arch frame"><Picture media={block.media} sizes="(min-width: 900px) 28vw, 70vw" /></div>
  <div class="founder-copy">
    <Text as="h2" text={block.title} class="h2" />
    <Actions actions={block.actions} />
  </div>
</div>
