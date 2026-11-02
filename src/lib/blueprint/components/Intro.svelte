<script lang="ts">
  // The first visit opens with the brand mark built from the bottom up, as the symbol is drawn:
  // the dome, then the volcano, then the light. It plays once per visit and never under reduced motion.
  import symbol from '../assets/symbol.svg?raw';
  import word from '../assets/word.svg?raw';
</script>

<div class="intro" data-intro aria-hidden="true">
  <div class="intro-mark">
    <span class="intro-symbol">{@html symbol}</span>
    <span class="intro-word">{@html word}</span>
  </div>
</div>
