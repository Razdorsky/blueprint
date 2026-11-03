<script lang="ts">
  // One Blueprint page in one language. Re-created on every navigation (keyed in the route),
  // so its context and its scroll scenes always belong to the page on screen.
  import {onMount, untrack} from 'svelte';
  import {provide} from './context.ts';
  import {content} from './content/pages.ts';
  import {route, sitePages, type Locale, type SitePage} from './site.ts';
  import {scenes} from './motion.ts';
  import Header from './components/Header.svelte';
  import Menu from './components/Menu.svelte';
  import Footer from './components/Footer.svelte';
  import Next from './components/Next.svelte';
  import Viewer from './components/Viewer.svelte';
  import Blocks from './blocks/Blocks.svelte';

  // Keyed by the route, so the props never change during this component's life.
  let props: {page: SitePage; locale: Locale} = $props();
  const {page, locale} = untrack(() => props);
  const {t} = provide(locale, page);
  const data = content[page.slug];
  const title = page.index === 1 ? t(data.title) : `${t(data.title)} | The Vessyl`;
  onMount(() => scenes(document.querySelector('[data-page-root]') as HTMLElement));
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={t(data.description)} />
  <link rel="alternate" hreflang="en" href={route(page.slug, 'en')} />
  <link rel="alternate" hreflang="es" href={route(page.slug, 'es')} />
</svelte:head>

<div class="page" data-page-root data-page={page.slug || 'home'} data-index={page.index} data-of={sitePages.length}>
  <a class="skip-link" href="#content">{t('Skip to content')}</a>
  <Header />
  <main id="content" class="page-main" class:staged={data.blocks.some(block => block.type === 'stage')}><Blocks blocks={data.blocks} /><Next /></main>
  <Footer />
  <Menu />
  <Viewer />
</div>
