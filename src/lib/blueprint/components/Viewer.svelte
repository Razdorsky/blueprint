<script lang="ts">
  // Full-screen photo viewer for galleries: keyboard arrows, swipe, Escape to close.
  import {bp} from '../context.ts';
  const {t} = bp();
</script>

<dialog class="viewer" data-viewer aria-label={t('Photographs')} data-tone="night">
  <p class="viewer-count" data-viewer-count></p>
  <button type="button" class="viewer-close" data-viewer-close>{t('Close')}</button>
  <div class="viewer-stage" data-viewer-stage><img alt="" data-viewer-image /></div>
  <p class="viewer-caption" data-viewer-caption></p>
  <button type="button" class="viewer-prev" data-viewer-prev aria-label={t('Previous photo')}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
  <button type="button" class="viewer-next" data-viewer-next aria-label={t('Next photo')}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
</dialog>
<div class="toast" role="status" data-toast hidden></div>
