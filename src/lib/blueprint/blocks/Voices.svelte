<script lang="ts">
  // The people behind the place: the founder's portrait beside what others have written about it.
  import {bp} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import Actions from '../components/Actions.svelte';
  import {asset} from '../media.ts';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'voices'}>} = $props();
  const {t} = bp();
  const marks = [
    ['Wallpaper*', '7011d3d7d75430e2b83e.svg'], ['Forbes Travel Guide', '33e0a6ed4360de92c1cb.svg'], ['The New York Times', 'ae6b496ab66d71e5b97e.webp'],
    ['Dwell', '04dd67845422361266a6.webp'], ['People Inc.', '2d1d21e0ebbc1c5a2373.webp'], ['Fast Company', '9bc8b4feecb8046bf649.svg'],
    ['Dow Jones', '4e43abc9edb08ae2dd79.svg'], ['The Skimm', 'c96d31fcfc210e7f30f5.webp']
  ];
</script>

<div class="wrap voices">
  <figure class="frame voices-portrait" data-reveal><Picture media={block.media} sizes="(min-width: 900px) 30vw, 80vw" /></figure>
  <div class="voices-copy">
    <figure class="voices-quote">
      <blockquote>{#each block.quote as paragraph}<Text text={paragraph} />{/each}</blockquote>
      <figcaption><span>{block.by}</span>{#if block.role}<span>{t(block.role)}</span>{/if}</figcaption>
    </figure>
    <div class="voices-founder">
      <Text text={block.founder} class="voices-line" />
      <Actions actions={block.actions} />
    </div>
  </div>
  <div class="voices-press">
    <h2 class="voices-press-title">{t(block.press)}</h2>
    <ul>
      {#each marks as [name, file] (name)}<li><img src={asset(`/media/${file}`)} alt={name} loading="lazy" /></li>{/each}
    </ul>
  </div>
</div>
