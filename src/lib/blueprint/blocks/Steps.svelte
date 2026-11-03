<script lang="ts">
  // A real sequence (an evening, a round in the Hearth). On wide screens the picture stays
  // in place and changes as each step is read.
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'steps'}>} = $props();
</script>

<div class="wrap steps" class:plain={block.numbered === false} data-steps>
  <div class="steps-head">
    <Text as="h2" text={block.title} class="h2" />
    {#each block.body || [] as paragraph}<Text text={paragraph} />{/each}
  </div>
  <div class="steps-body">
    <div class="steps-stage" aria-hidden="true">
      {#each block.items as step, index (step.title)}
        {#if step.media}<div class="steps-shot" class:active={index === 0} data-shot={index}><Picture media={step.media} sizes="(min-width: 900px) 40vw, 90vw" ratio={0.8} /></div>{/if}
      {/each}
    </div>
    <ol class="steps-list">
      {#each block.items as step, index (step.title)}
        <li class="step" data-step={index}>
          {#if block.numbered !== false}<span class="step-number">{index + 1}</span>{/if}
          <Text as="h3" text={step.title} class="h3" />
          <Text text={step.text} />
          {#if step.media}<div class="step-media frame"><Picture media={step.media} sizes="90vw" ratio={0.8} /></div>{/if}
        </li>
      {/each}
    </ol>
  </div>
  <Actions actions={block.actions} />
</div>
