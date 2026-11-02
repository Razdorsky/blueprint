<script lang="ts">
  // No subscription service is connected: the form validates and says so plainly, sending nothing.
  import {bp, rich} from '../context.ts';
  let {variant}: {variant?: 'events'} = $props();
  const {t} = bp();
  const id = $derived(`newsletter-${variant || 'default'}`);
  let status = $state('');
  function submit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (form.reportValidity()) status = t('Subscriptions are not connected in this preview. Your address has not been sent or saved.');
  }
</script>

<div class="wrap newsletter">
  <div>
    <h2 class="h2" id="{id}-title">{t(variant === 'events' ? 'Tell me what is coming up' : 'Three or four emails a year')}</h2>
    <p>{@html rich(t(variant === 'events'
      ? 'Nothing on tonight is a normal state of affairs. The calendar runs [how often], and we announce new nights by email first, because they are small and they sell out.'
      : 'What is open, who is playing, what the river is doing. Nothing else.'))}</p>
  </div>
  <form class="newsletter-form" onsubmit={submit} aria-labelledby="{id}-title">
    <label for="{id}-email">{t('Email address')}</label>
    <div class="newsletter-row">
      <input id="{id}-email" type="email" autocomplete="email" required placeholder={t('you@example.com')} />
      <button type="submit" class="button">{t('Subscribe')}</button>
    </div>
    <p class="newsletter-status" role="status">{status}</p>
  </form>
</div>
