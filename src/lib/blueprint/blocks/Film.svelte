<script lang="ts">
  // The legacy Blueprint film behaviour: a silent loop while it is on screen; a tap starts it
  // again from the beginning with sound; then pause and sound controls appear.
  import {onMount} from 'svelte';
  import {bp, rich} from '../context.ts';
  import Text from '../components/Text.svelte';
  import {film} from '../media.ts';
  import type {Block} from '../content/types.ts';

  let {block}: {block: Extract<Block, {type: 'film'}>} = $props();
  const {t} = bp();
  let source = $derived(film(block.film));
  let video: HTMLVideoElement;
  let opened = false;
  let activated = $state(false);
  let playing = $state(false);
  let muted = $state(true);

  onMount(() => {
    let visible = false;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (!visible || document.hidden) video.pause();
      else if (!opened) reduced.matches ? video.pause() : video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {visible = entry.isIntersecting && entry.intersectionRatio >= 0.15; sync();}, {threshold: 0.15});
    observer.observe(video);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {video.pause(); observer.disconnect(); reduced.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync);};
  });

  function playFromStart() {
    opened = true;
    activated = true;
    video.muted = false;
    video.loop = false;
    video.currentTime = 0;
    video.play().catch(() => {});
  }
  function toggle() {
    if (video.paused) {if (video.ended) video.currentTime = 0; video.play().catch(() => {});}
    else video.pause();
  }
</script>

<div class="wrap film-block">
  <div class="film-head">
    <Text as="h2" text={block.title} class="h2" />
    {#if block.body}<p>{@html rich(t(block.body))}</p>{/if}
  </div>
  <div class="film" class:activated>
    <video bind:this={video} width="1920" height="1080" poster={source.poster} muted loop={!activated} playsinline preload="none"
      onplay={() => (playing = true)} onpause={() => (playing = false)} onended={() => (playing = false)}
      onvolumechange={() => (muted = video.muted)}>
      <source src={source.src} type="video/mp4" />
    </video>
    <button type="button" class="film-action" onclick={activated ? toggle : playFromStart}
      aria-label={activated ? (playing ? t('Pause film') : t('Resume film')) : t('Play film from the beginning with sound')}>
      {#if !activated}<span class="film-cue">{t('Watch with sound')}</span>{/if}
    </button>
    <div class="film-controls" role="group" aria-label={t('Film controls')}>
      {#if activated}
        <button type="button" onclick={toggle} aria-label={playing ? t('Pause film') : t('Play film')}>
          {#if playing}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>{:else}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" /></svg>{/if}
        </button>
      {/if}
      <button type="button" aria-label={muted ? t('Unmute film') : t('Mute film')} onclick={() => (activated ? (video.muted = !video.muted) : playFromStart())}>
        {#if muted}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6" /></svg>{:else}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 8a5 5 0 0 1 0 8M19.5 5.5a9 9 0 0 1 0 13" /></svg>{/if}
      </button>
    </div>
  </div>
</div>
