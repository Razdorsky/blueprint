<script lang="ts">
  // Inside the Dome. The circle is the ceiling seen from the floor; as the page moves, the
  // projection drifts from one state to the next and the words beside it change with it.
  // Nothing is written over the projection.
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'projection'}>} = $props();
</script>

<div class="projection" data-projection>
  <div class="wrap projection-stage" data-stage>
    <div class="projection-copy">
      <Text as="h2" text={block.title} class="h2" />
      <ul class="projection-states">
        {#each block.states as state, index (state.text)}
          <li class="projection-state" class:active={index === 0} data-state={index}><Text text={state.text} /></li>
        {/each}
      </ul>
      <Actions actions={block.actions} />
    </div>
    <div class="projection-dome">
      <div class="projection-circle" data-circle>
        {#each block.states as state, index (state.text)}
          <div class="projection-shot" class:active={index === 0} data-shot={index}><Picture media={state.media} sizes="(min-width: 900px) 46vw, 88vw" /></div>
        {/each}
      </div>
    </div>
  </div>
</div>
