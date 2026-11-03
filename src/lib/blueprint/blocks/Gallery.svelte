<script lang="ts">
  // A grid of equal photographs, one shape for the group; any of them opens the full-screen viewer.
  import {bp} from '../context.ts';
  import Text from '../components/Text.svelte';
  import Picture from '../components/Picture.svelte';
  import {photo} from '../media.ts';
  import type {Block} from '../content/types.ts';
  let {block}: {block: Extract<Block, {type: 'gallery'}>} = $props();
  const {t} = bp();
</script>

<div class="wrap gallery" data-gallery>
  {#if block.title}<Text as="h2" text={block.title} class="h2" />{/if}
  <ul class="gallery-grid" data-count={block.items.length}>
    {#each block.items as media, index (index)}
      {@const full = 'photo' in media ? photo(media.photo) : null}
      <li class="gallery-item">
        <button type="button" class="frame" data-gallery-item data-full={full?.src} data-srcset={full?.srcset} data-alt={t(media.alt)} aria-label={`${t('Open photo')}: ${t(media.alt)}`}>
          <Picture {media} sizes="(min-width: 900px) 33vw, 50vw" ratio={0.8} />
        </button>
      </li>
    {/each}
  </ul>
</div>
