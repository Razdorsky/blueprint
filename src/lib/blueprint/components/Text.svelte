<script lang="ts">
  // Translated text with inline marks. `as` picks the element; the content is our own data.
  import {bp, rich} from '../context.ts';
  let {text, as = 'p', class: className = '', id}: {text: string; as?: string; class?: string; id?: string} = $props();
  const {t} = bp();
</script>

<svelte:element this={as} class={className || undefined} {id}>{@html rich(t(text))}</svelte:element>
