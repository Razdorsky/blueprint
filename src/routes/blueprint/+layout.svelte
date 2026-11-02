<script lang="ts">
  // Blueprint edition shell. Owns its fonts, styles and motion; shares nothing with the Figma edition.
  import {onMount, type Snippet} from 'svelte';
  import {afterNavigate, beforeNavigate, goto, onNavigate} from '$app/navigation';
  import {page} from '$app/state';
  import {ground, resolve} from '#lib/blueprint/site.ts';
  import {install, smooth} from '#lib/blueprint/motion.ts';
  import Intro from '#lib/blueprint/components/Intro.svelte';
  import '@fontsource-variable/eb-garamond/wght.css';
  import '@fontsource-variable/eb-garamond/wght-italic.css';
  import '@fontsource/roboto/300.css';
  import '@fontsource/roboto/400.css';
  import '@fontsource/roboto/500.css';
  import '#lib/blueprint/styles/tokens.css';
  import '#lib/blueprint/styles/base.css';
  import '#lib/blueprint/styles/blocks.css';
  import '#lib/blueprint/styles/motion.css';

  let {children}: {children: Snippet} = $props();
  let edition: ReturnType<typeof install> | undefined;
  /** Scroll position to restore after a language switch (the page is rebuilt in the other language). */
  let keep: number | undefined;

  const mark = () => {
    const found = resolve(page.params.slug || '');
    const root = document.documentElement;
    root.lang = found?.locale || 'en';
    document.body.dataset.edition = 'blueprint';
    document.body.dataset.page = found?.page.slug || 'home';
    root.style.setProperty('--canvas', ground(found?.page.tone || 'paper'));
  };

  onMount(() => {
    edition = install();
    // The language switch keeps your place: same scroll, text dissolves into the other language.
    const switchLanguage = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.<HTMLAnchorElement>('a[data-locale]');
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      if (link.getAttribute('aria-current')) return;
      document.documentElement.dataset.vt = 'locale';
      keep = window.scrollY;
      goto(link.href, {reset: false});
    };
    document.addEventListener('click', switchLanguage);
    return () => {document.removeEventListener('click', switchLanguage); edition?.destroy();};
  });

  beforeNavigate(() => edition?.closeOverlays());
  afterNavigate(() => {
    mark();
    const lenis = smooth();
    lenis?.resize();
    const y = keep ?? window.scrollY;
    keep = undefined;
    window.scrollTo(0, y);
    lenis?.scrollTo(y, {immediate: true, force: true});
  });

  let active: ViewTransition | undefined;
  onNavigate(navigation => {
    active?.skipTransition();
    const root = document.documentElement;
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches || navigation.from?.url.href === navigation.to?.url.href) {
      delete root.dataset.vt;
      return;
    }
    if (root.dataset.vt !== 'locale') root.dataset.vt = 'fog';
    return new Promise<void>(resolveTransition => {
      const transition = document.startViewTransition(async () => {resolveTransition(); await navigation.complete;});
      active = transition;
      transition.ready.catch(() => {});
      transition.finished.finally(() => {if (active === transition) {active = undefined; delete root.dataset.vt;}}).catch(() => {});
    });
  });
</script>

<svelte:head>
  {@html `<script>try{if(!sessionStorage.getItem('vessyl:intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='on'}catch(e){}</script>`}
</svelte:head>

<Intro />
{@render children()}
