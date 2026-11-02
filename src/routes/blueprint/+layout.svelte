<script lang="ts">
  // Blueprint edition shell. Owns its styles and interactions; shares nothing with the Figma edition.
  import {onMount, type Snippet} from 'svelte';
  import {afterNavigate, beforeNavigate, onNavigate} from '$app/navigation';
  import {page} from '$app/state';
  import {canvas, pages} from '#lib/blueprint/site.ts';
  import {installInteractions, enhancePage, closeOverlays} from '#lib/blueprint/interactions.js';
  import '#lib/blueprint/styles/base.css';
  import '#lib/blueprint/styles/blueprint.css';

  let {children}: {children:Snippet} = $props();
  onMount(installInteractions);
  beforeNavigate(() => closeOverlays());
  afterNavigate(() => {
    const item = pages.find(item => item.slug === (page.params.slug || '').replace(/^\/|\/$/g,''));
    document.body.dataset.edition = 'blueprint';
    document.body.dataset.page = item?.slug || 'home';
    document.body.dataset.heroTheme = item?.photo ? 'photo' : 'paper';
    document.documentElement.style.setProperty('--canvas', canvas(item?.index || 0));
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
