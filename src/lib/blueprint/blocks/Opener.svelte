<script lang="ts">
  // An opening in the page: the sheets part and the place on the stage shows through. A film
  // place carries the film's controls here.
  import {bp, rich} from '../context.ts';
  import {places, isFilm} from '../stages.ts';
  import type {Block} from '../content/types.ts';
  let {block, first = false}: {block: Extract<Block, {type: 'stage'}>; first?: boolean} = $props();
  const {t} = bp();
  let film = $derived(isFilm(places[block.place]));
</script>

<section class="b b-stage" class:first data-tone="night" data-opener={block.place}>
  {#if film}
    <div class="wrap opener-film">
      {#if block.caption}<p class="opener-caption">{@html rich(t(block.caption))}</p>{/if}
      <button type="button" class="opener-play" data-film-play>
        <span class="opener-play-ring" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6.5v11l9-5.5z" /></svg></span>
        <span>{t('Watch the film with sound')}</span>
      </button>
      <span class="opener-controls">
        <!-- The toggle names what it will do next; stage.ts swaps its name and icon as the film plays or stops. -->
        <button type="button" data-film-toggle data-playing="true" aria-label={t('Pause the film')} data-label-pause={t('Pause the film')} data-label-play={t('Play the film')}>
          <svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
          <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" /></svg>
        </button>
        <button type="button" data-film-mute aria-pressed="false" aria-label={t('Mute the film')}>
          <svg class="icon-sound" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 8a5 5 0 0 1 0 8" /></svg>
          <svg class="icon-muted" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 9.5l5 5M22 9.5l-5 5" /></svg>
        </button>
      </span>
    </div>
  {/if}
</section>
