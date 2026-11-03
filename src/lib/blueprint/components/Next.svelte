<script lang="ts">
  // The open door at the end of every page: the next page's own opening picture, large, with
  // its name and one line of what is there. The arch opens as it comes into view, the way the
  // next page's opening does, so the click continues the same movement.
  import {bp, rich} from '../context.ts';
  import Picture from './Picture.svelte';
  import {content, opening} from '../content/pages.ts';
  import {next, route} from '../site.ts';
  const {t, page, locale} = bp();
  const following = next(page);
  // The arrow travels with the last word, so it never wraps onto a line of its own.
  const name = t(following.index === 1 ? 'The Vessyl' : following.name);
  const words = name.split(' ');
  const lead = words.slice(0, -1).join(' ');
  const last = words[words.length - 1];
  const target = content[following.slug];
  const media = opening(following.slug);
  // The close stays in the light the page ended in.
  const blocks = content[page.slug].blocks;
  const tone = blocks[blocks.length - 1].tone || 'paper';
</script>

<section class="b b-next" data-tone={tone}>
  <a class="next" href={route(following.slug, locale)} data-next>
    <span class="wrap next-head">
      <span class="next-title">{lead ? `${lead} ` : ''}<span class="next-tail">{last}<span class="next-go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4.5 12h14.5M13 6l6 6-6 6" /></svg></span></span></span>
      <span class="next-line">{@html rich(t(target.description))}</span>
    </span>
    <span class="wrap next-frame"><span class="next-media" data-next-arch><Picture {media} sizes="100vw" ratio={1.6} /></span></span>
  </a>
</section>
