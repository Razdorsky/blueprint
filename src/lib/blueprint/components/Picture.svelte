<script lang="ts">
  // A photograph or a silent loop. Loops start only while on screen and never under reduced motion.
  import {bp} from '../context.ts';
  import {loop, photo} from '../media.ts';
  import type {Media} from '../content/types.ts';

  let {media, sizes = '100vw', eager = false, ratio, class: className = ''}: {media: Media; sizes?: string; eager?: boolean; ratio?: number; class?: string} = $props();
  const {t} = bp();
  let image = $derived('photo' in media ? photo(media.photo) : null);
  let video = $derived('loop' in media ? loop(media.loop) : null);
  // A frame that crops its picture (ratio: the frame's width over its height) draws a wider picture
  // as tall as the frame, so the browser needs a file wider than the frame: the sizes grow to match.
  let need = $derived(image && ratio ? Math.max(1, image.w / image.h / ratio) : 1);
  let wanted = $derived(need > 1 ? sizes.replace(/(\d+(?:\.\d+)?)vw/g, (_, n) => `${Math.round(+n * need)}vw`) : sizes);
</script>

{#if image}
  <img class={className} src={image.src} srcset={image.srcset} sizes={wanted} width={image.w} height={image.h} alt={t(media.alt)}
    loading={eager ? 'eager' : 'lazy'} fetchpriority={eager ? 'high' : 'auto'} decoding="async"
    style:background-color={image.color} style:object-position={media.focus} />
{:else if video}
  <video class={className} data-loop muted loop playsinline preload={eager ? 'auto' : 'none'} poster={video.poster} aria-label={t(media.alt)} style:object-position={media.focus}>
    {#if video.phone}<source src={video.phone} type="video/mp4" media="(max-width: 899px)" />{/if}
    <source src={video.src} type="video/mp4" />
  </video>
{/if}
