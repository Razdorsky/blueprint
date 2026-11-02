<script lang="ts">
  import {onMount, type Snippet} from 'svelte';
  import {afterNavigate, beforeNavigate, onNavigate} from '$app/navigation';
  import {page} from '$app/state';
  import {canvas, pages} from '#lib/site.ts';
  import {installInteractions, enhancePage, closeOverlays} from '#lib/interactions.js';
  import '../shared.css';
  import '../figma.css';
  import '../blueprint.css';

  let {children}: {children:Snippet} = $props();
  onMount(installInteractions);
  beforeNavigate(() => closeOverlays());
  afterNavigate(() => {
    const edition = page.params.edition || '';
    const item = pages.find(item => item.slug === (page.params.slug || '').replace(/^\/|\/$/g,''));
    document.body.dataset.edition = edition;
    document.body.dataset.page = item?.slug || 'home';
    document.body.dataset.heroTheme = item?.photo ? 'photo' : 'paper';
    document.documentElement.style.setProperty('--canvas', canvas(edition, item?.index || 0));
    enhancePage();
  });
  let activeTransition: ViewTransition | undefined;
  onNavigate(navigation => {
    activeTransition?.skipTransition();
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches || navigation.shallow) return;
    return new Promise<void>(resolve => {
      const transition = document.startViewTransition(async () => {resolve();await navigation.complete;});
      activeTransition = transition;
      void transition.ready.catch(() => {});
      void transition.finished.finally(() => {if(activeTransition === transition)activeTransition = undefined;}).catch(() => {});
    });
  });
</script>

{@render children()}
<div class="preview-toast" role="status" hidden></div>
