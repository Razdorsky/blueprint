<script lang="ts">
  import {base} from '#lib/enhanced/site.ts';
  type Props = { pageIndex: number };
  let { pageIndex }: Props = $props();
  let events = $derived(pageIndex === 13);
  // The closing photograph the footer melts into (docs/figma-enhanced-plan.md, step 1.5). The Frequency Dome page
  // opens on the same night photograph, so it closes on another one.
  let closing = $derived(pageIndex === 14
    ? {src: '46c02cfc7ce0c5cd9c65.webp', width: 2400, height: 1502}
    : {src: 'fe78e39c5c2e5fd2d9bc.webp', width: 2048, height: 1281});
  let status = $state('');
  let formState = $state<'' | 'error' | 'notice'>('');
  function submit(event:SubmitEvent){
    event.preventDefault();
    const form=event.currentTarget as HTMLFormElement;
    const input=form.elements.namedItem('email') as HTMLInputElement;
    if(!input.checkValidity()){
      formState='error';
      status=input.value?'This address is incomplete. Check it, for example name@example.com.':'Enter your email address, for example name@example.com.';
      input.focus();
      return;
    }
    formState='notice';
    status='Subscriptions are not connected in this local preview. Your address has not been sent or saved.';
  }
  function edit(){if(formState==='error'){formState='';status='';}}
</script>

<section
  class:newsletter-events={events}
  class:newsletter-closing={!events}
  class="site-newsletter newsletter"
  aria-labelledby="newsletter-title"
>
  {#if !events}
    <figure class="newsletter-photo" aria-hidden="true">
      <img src={`${base}/media/${closing.src}`} alt="" loading="lazy" decoding="async" width={closing.width} height={closing.height} />
    </figure>
  {/if}
  <div class="newsletter-inner">
    <div>
      <p class="newsletter-eyebrow">{events ? 'Coming events' : 'Best time to visit us'}</p>
      <h2 id="newsletter-title">{events ? 'Tell me what is coming up' : 'Three or four emails a year'}</h2>
      <p>
        {events
          ? 'Nothing on tonight is a normal state of affairs. The calendar runs [how often], and we announce new nights by email first, because they are small and they sell out.'
          : 'What is open, who is playing, what the river is doing. Nothing else.'}
      </p>
    </div>
    <form class="newsletter-form" novalidate onsubmit={submit} data-state={formState || undefined}>
      <label class="sr-only" for="newsletter-email">Email address</label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="ronnie@aave.com"
        required
        aria-invalid={formState === 'error' ? 'true' : undefined}
        aria-describedby="newsletter-status"
        oninput={edit}
      />
      <button type="submit">SUBSCRIBE</button>
      <p id="newsletter-status" class="newsletter-status" aria-live="polite">{status}</p>
    </form>
  </div>
</section>
