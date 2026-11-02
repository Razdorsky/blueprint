<script lang="ts">
import {base, canvas} from '#lib/blueprint/site.ts';
import Header from '#lib/blueprint/components/Header.svelte';
import Footer from '#lib/blueprint/components/Footer.svelte';
import Menu from '#lib/blueprint/components/Menu.svelte';
import Gallery from '#lib/blueprint/components/Gallery.svelte';
import type {PageData} from './$types';
import P01 from '#lib/blueprint/pages/P01.svelte';
import P02 from '#lib/blueprint/pages/P02.svelte';
import P03 from '#lib/blueprint/pages/P03.svelte';
import P04 from '#lib/blueprint/pages/P04.svelte';
import P05 from '#lib/blueprint/pages/P05.svelte';
import P06 from '#lib/blueprint/pages/P06.svelte';
import P07 from '#lib/blueprint/pages/P07.svelte';
import P08 from '#lib/blueprint/pages/P08.svelte';
import P09 from '#lib/blueprint/pages/P09.svelte';
import P10 from '#lib/blueprint/pages/P10.svelte';
import P11 from '#lib/blueprint/pages/P11.svelte';
import P12 from '#lib/blueprint/pages/P12.svelte';
import P13 from '#lib/blueprint/pages/P13.svelte';
let {data}: {data:PageData}=$props();
const components=[P01,P02,P03,P04,P05,P06,P07,P08,P09,P10,P11,P12,P13];
let Content=$derived(components[data.page.index-1]);
</script>
<svelte:head><title>{data.page.name} — The Vessyl</title><meta name="description" content={`${data.page.name} — The Vessyl in Arenal, Costa Rica`}/><meta name="theme-color" content={canvas(data.page.index)}/></svelte:head>
<a class="skip-link" href="#content">Skip to content</a>
<Header page={data.page} {base}/>
<main class="current-page" id="content" data-page={data.page.slug||'home'} data-index={String(data.page.index).padStart(2,'0')}><Content {base}/></main>
<Footer page={data.page} {base}/>
<Menu page={data.page} {base}/>
<Gallery/>
