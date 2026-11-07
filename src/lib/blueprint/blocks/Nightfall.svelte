<script lang="ts">
  // Night arrives as the Dome. The dusk photograph fills the screen; a dark arch rises over it
  // and widens until night covers it. The ground changes at the arch's edge, never in a gradient.
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'nightfall'}>} = $props();
</script>

<div class="nightfall" data-nightfall>
  <div class="nightfall-sky"><Picture media={block.media} sizes="100vw" /></div>
  <div class="nightfall-panel" data-panel>
    <div class="wrap nightfall-body">
      <Text as="h2" text={block.title} class="h2 nightfall-title" />
      <div class="nightfall-grid">
        <figure class="frame nightfall-aside" data-reveal><Picture media={block.aside} sizes="(min-width: 900px) 34vw, 92vw" /></figure>
        <div class="nightfall-copy">
          {#each block.body as paragraph}<Text text={paragraph} />{/each}
          <Actions actions={block.actions} />
        </div>
      </div>
    </div>
  </div>
</div>
