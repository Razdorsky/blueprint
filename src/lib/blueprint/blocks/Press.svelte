<script lang="ts">
  // Press marks drift past slowly; under reduced motion they simply sit in a row.
  import {bp} from '../context.ts';
  import {asset} from '../media.ts';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'press'}>} = $props();
  const {t} = bp();
  const marks = [
    ['Wallpaper*', '7011d3d7d75430e2b83e.svg'], ['Forbes Travel Guide', '33e0a6ed4360de92c1cb.svg'], ['The New York Times', 'ae6b496ab66d71e5b97e.webp'],
    ['Dwell', '04dd67845422361266a6.webp'], ['People Inc.', '2d1d21e0ebbc1c5a2373.webp'], ['Fast Company', '9bc8b4feecb8046bf649.svg'],
    ['Dow Jones', '4e43abc9edb08ae2dd79.svg'], ['The Skimm', 'c96d31fcfc210e7f30f5.webp']
  ];
</script>

<div class="press">
  <h2 class="wrap press-title">{t(block.title)}</h2>
  <div class="press-band">
    <ul class="press-row">
      {#each [...marks, ...marks] as [name, file], index (index)}
        <li aria-hidden={index >= marks.length ? 'true' : undefined}><img src={asset(`/media/${file}`)} alt={index < marks.length ? name : ''} loading="lazy" /></li>
      {/each}
    </ul>
  </div>
</div>
