<script lang="ts">
  // The fixed stage behind a page told in places (stage.ts draws it). The plain layers below the
  // canvas stand in where WebGL is missing and under reduced motion: the picture, the word, and the
  // subject cut out in front of the word. Their pictures load only when they are needed (stage.ts
  // gives them their sources); the first place's picture loads at once, for a page without scripts.
  import {bp} from '../context.ts';
  import {film as filmMedia} from '../media.ts';
  import {places, isFilm, type PlaceName, type Variant} from '../stages.ts';
  let {names}: {names: PlaceName[]} = $props();
  const {t} = bp();
  // Each crop is framed on its own subject, as on the canvas.
  const focus = (v: Variant) => `${v.focus[0] * 100}% ${v.focus[1] * 100}%`;
</script>

<div class="stage" data-stage aria-hidden="true">
  {#each names as name, index (name)}
    {@const place = places[name]}
    {#if isFilm(place)}
      {@const source = filmMedia(place.film)}
      <div class="stage-place stage-film" class:on={index === 0} data-place={name}>
        <video data-film-video data-full={source.src} muted loop playsinline preload="none" poster={source.poster}>
          <source src={source.previewPhone} type="video/mp4" media="(max-width: 899px)" />
          <source src={source.preview} type="video/mp4" />
        </video>
      </div>
    {:else}
      <div class="stage-place" class:on={index === 0} data-place={name} style:--sky={place.sky} style:--focus={focus(place.desktop)} style:--focus-upright={focus(place.phone)} style:--dim={place.desktop.dim ?? 1} style:--dim-upright={place.phone.dim ?? 1}>
        <picture>
          <source media="(max-aspect-ratio: 9/10)" data-srcset={place.phone.flat} srcset={index === 0 ? place.phone.flat : undefined} />
          <img class="stage-flat" data-src={place.desktop.flat} src={index === 0 ? place.desktop.flat : undefined} alt="" />
        </picture>
        <span class="stage-word" data-word>{t(place.word)}</span>
        <picture>
          <source media="(max-aspect-ratio: 9/10)" data-srcset={place.phone.cut} />
          <img class="stage-cut" data-src={place.desktop.cut} alt="" />
        </picture>
      </div>
    {/if}
  {/each}
  <canvas class="stage-canvas" data-stage-canvas></canvas>
</div>
