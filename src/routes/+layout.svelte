<script lang="ts">
  // Edition-neutral root. Each edition (routes/figma, routes/blueprint) owns its styles and scripts.
  import type {Snippet} from 'svelte';
  let {children}: {children:Snippet} = $props();
</script>

{@render children()}
