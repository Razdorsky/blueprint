<script lang="ts">import {base} from '#lib/site.ts';import {photo} from '#lib/site.ts';</script>
<svelte:head><title>The current Vessyl website</title><meta name="description" content="Thirteen current Vessyl pages, two visual directions"/></svelte:head>
<main class="edition-picker" style={`background-image:linear-gradient(#1119,#111b),url('${base}${photo(1)}')`}>
<img src={`${base}/brand/logo-white.svg`} alt="VESSYL"/>
<h1>The Vessyl, two ways</h1><p>The current story. Thirteen pages. Two visual directions.</p>
<div class="edition-options"><a href={`${base}/blueprint/`}>Explore Blueprint direction ↗</a><a href={`${base}/figma/`}>Explore Figma direction ↗</a></div>
</main>
