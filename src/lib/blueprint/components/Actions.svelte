<script lang="ts">
  // Calls to action. Destinations the owner has not supplied stay honest: they explain instead of navigating.
  import {bp} from '../context.ts';
  import type {Action} from '../content/types.ts';

  let {actions = []}: {actions?: Action[]} = $props();
  const {t, href} = bp();
</script>

{#if actions.length}
  <div class="actions">
    {#each actions as action (action.label)}
      {@const url = href(action.to)}
      {#if url}
        <a class={action.primary ? 'button' : 'link'} href={url} target={action.to === 'booking' ? '_blank' : undefined} rel={action.to === 'booking' ? 'noopener noreferrer' : undefined}>{t(action.label)}</a>
      {:else}
        <button type="button" class={action.primary ? 'button' : 'link'} data-pending>{t(action.label)}</button>
      {/if}
    {/each}
  </div>
{/if}
