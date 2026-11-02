<script lang="ts">
  import Page from '#lib/blueprint/Page.svelte';
  import type {PageData} from './$types';
  let {data}: {data: PageData} = $props();
</script>

{#key `${data.locale}/${data.page.slug}`}
  <Page page={data.page} locale={data.locale} />
{/key}
