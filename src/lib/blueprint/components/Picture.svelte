<script lang="ts">
  // A photograph or a silent loop. Loops start only while on screen and never under reduced motion.
  import {bp} from '../context.ts';
  import {loop, photo} from '../media.ts';
  import type {Media} from '../content/types.ts';

  let {media, sizes = '100vw', eager = false, class: className = ''}: {media: Media; sizes?: string; eager?: boolean; class?: string} = $props();
  const {t} = bp();
  let image = $derived('photo' in media ? photo(media.photo) : null);
  let video = $derived('loop' in media ? loop(media.loop) : null);
</script>

{#if image}
  <img class={className} src={image.src} srcset={image.srcset} {sizes} width={image.w} height={image.h} alt={t(media.alt)}
    loading={eager ? 'eager' : 'lazy'} fetchpriority={eager ? 'high' : 'auto'} decoding="async"
    style:background-color={image.color} style:object-position={media.focus} />
{:else if video}
  <video class={className} data-loop muted loop playsinline preload={eager ? 'auto' : 'none'} poster={video.poster} aria-label={t(media.alt)} style:object-position={media.focus}>
    {#if video.phone}<source src={video.phone} type="video/mp4" media="(max-width: 899px)" />{/if}
    <source src={video.src} type="video/mp4" />
  </video>
{/if}
