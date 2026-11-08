<script lang="ts">
  // Figma Enhanced edition shell. Started as a copy of the frozen Figma edition (2026-11-07).
  import {onMount, type Snippet} from 'svelte';
  import {afterNavigate, beforeNavigate, onNavigate} from '$app/navigation';
  import {page} from '$app/state';
  import {canvas, pages} from '#lib/enhanced/site.ts';
  import {installInteractions, enhancePage, closeOverlays, smooth} from '#lib/enhanced/interactions.js';
  import 'lenis/dist/lenis.css';
  import '#lib/enhanced/styles/shell.css';
  import '#lib/enhanced/styles/shell-edition.css';
  import '#lib/enhanced/styles/tokens.css';
  import '#lib/enhanced/styles/system.css';
  import '#lib/enhanced/styles/focus.css';
  import '#lib/enhanced/styles/header.css';
  import '#lib/enhanced/styles/motion.css';

  let {children}: {children:Snippet} = $props();
  onMount(installInteractions);
  // Step 2.2: any glide still running stops when a navigation starts (Back right after a wheel included).
  beforeNavigate(() => {closeOverlays();smooth()?.stop();});
  afterNavigate(() => {
    const edition = 'figma-enhanced';
    const item = pages.find(item => item.slug === (page.params.slug || '').replace(/^\/|\/$/g,''));
    document.body.dataset.edition = edition;
    document.body.dataset.page = item?.slug || 'home';
    document.body.dataset.heroTheme = item?.photo ? 'photo' : 'paper';
    document.documentElement.style.setProperty('--canvas', canvas(edition, item?.index || 0));
    // Step 2.2: Lenis follows the position SvelteKit chose, so it never scrolls the new page back.
    const lenis = smooth();
    if (lenis && !document.querySelector('dialog[open]')) lenis.start();
    lenis?.resize();
    lenis?.scrollTo(window.scrollY, {immediate: true, force: true});
    enhancePage();
  });

  // Step 2.2 (docs/figma-enhanced-step2.md): the Legacy Blueprint page transition. The page dissolves; when the
  // departing opening is on screen, the openings travel together and the new photograph settles from 110%.
  const opening = () => document.querySelector<HTMLElement>('.current-page > section:first-child');
  const onScreen = (element: Element | null, share: number) => {
    const box = element?.getBoundingClientRect();
    return !!box && box.top > -innerHeight * 0.25 && box.bottom > innerHeight * share;
  };
  async function photoReady() {
    const image = document.querySelector<HTMLImageElement>('.current-page > [data-role="photo-hero"]:first-child [data-part="hero-image"] img');
    if (!image) return null;
    await Promise.race([image.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 400))]);
    return image.complete && image.naturalWidth ? image : null;
  }
  let activeTransition: ViewTransition | undefined;
  onNavigate(navigation => {
    activeTransition?.skipTransition();
    const root = document.documentElement;
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches || navigation.shallow
      || navigation.from?.url.pathname === navigation.to?.url.pathname) {
      delete root.dataset.vt;
      return;
    }
    const header = document.querySelector('[data-header]');
    root.dataset.vt = onScreen(opening(), 0.4) ? 'hero' : 'dissolve';
    root.dataset.vtHeader = header && !header.classList.contains('is-away') ? 'shared' : 'none';
    let arriving: HTMLImageElement | null = null;
    return new Promise<void>(resolveNavigation => {
      const transition = document.startViewTransition(async () => {
        resolveNavigation();
        await navigation.complete;
        // The new page is in: its opening joins the transition when the page starts at the top.
        arriving = scrollY < 2 ? await photoReady() : null;
        root.dataset.vt = scrollY < 2 ? 'hero' : 'dissolve';
      });
      activeTransition = transition;
      transition.ready.then(() => {
        if (!arriving) return;
        // The build may write the token in seconds (".8s"), so read its unit.
        const token = getComputedStyle(root).getPropertyValue('--vt-scene').trim();
        const time = (parseFloat(token) * (token.endsWith('ms') ? 1 : 1000)) || 800;
        arriving.animate([{scale: 1.1}, {scale: 1}], {duration: time, easing: 'cubic-bezier(0.4, 0, 0.2, 1)'});
      }).catch(() => {});
      transition.finished.finally(() => {
        if (activeTransition !== transition) return;
        activeTransition = undefined;
        delete root.dataset.vt;
        delete root.dataset.vtHeader;
      }).catch(() => {});
    });
  });
</script>

{@render children()}
<div class="preview-toast" role="status" hidden></div>
