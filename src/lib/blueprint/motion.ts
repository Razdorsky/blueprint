// Blueprint motion. Brand rule: motion moves at the speed of breath, starts and ends in
// stillness, arrives from depth rather than from the side, and fog is the only transition.
// `install` runs once for the edition (scroll, dialogs, viewer, notices); `scenes` runs for
// each page and is undone when the page leaves.
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {translate} from './i18n.ts';
import type {Locale} from './site.ts';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | undefined;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const locale = () => (document.documentElement.lang === 'es' ? 'es' : 'en') as Locale;
const t = (text: string) => translate(locale(), text);

export const smooth = () => lenis;

/** Edition-wide behaviour. Returns a cleanup for the layout. */
export function install() {
  const controller = new AbortController();
  const on = <K extends keyof DocumentEventMap>(name: K, fn: (event: DocumentEventMap[K]) => void, options: AddEventListenerOptions = {}) =>
    document.addEventListener(name, fn, {...options, signal: controller.signal});

  if (!reduced()) {
    lenis = new Lenis({lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true});
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    controller.signal.addEventListener('abort', () => {gsap.ticker.remove(raf); lenis?.destroy(); lenis = undefined;});
  }

  // The opening mark plays once per visit.
  const root = document.documentElement;
  if (root.dataset.intro === 'on') {
    lenis?.stop();
    window.setTimeout(() => {
      root.dataset.intro = 'done';
      lenis?.start();
      try {sessionStorage.setItem('vessyl:intro', '1');} catch {/* private mode still works */}
    }, 3100);
  }

  let toastTimer = 0;
  const notify = (message: string) => {
    const toast = document.querySelector<HTMLElement>('[data-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => (toast.hidden = true), 5200);
  };

  // Menu
  const menu = () => document.querySelector<HTMLDialogElement>('#site-menu');
  const openMenu = (button: Element) => {
    const dialog = menu();
    if (!dialog || dialog.open) return;
    dialog.showModal();
    dialog.classList.remove('closing');
    button.setAttribute('aria-expanded', 'true');
    lenis?.stop();
  };
  const closeMenu = (immediate = false) => {
    const dialog = menu();
    if (!dialog?.open) return;
    const finish = () => {dialog.classList.remove('closing'); dialog.close(); lenis?.start(); document.querySelector('[data-menu-open]')?.setAttribute('aria-expanded', 'false');};
    if (immediate || reduced()) return finish();
    dialog.classList.add('closing');
    window.setTimeout(finish, 520);
  };

  // Viewer
  let shots: {src: string; srcset: string; alt: string}[] = [];
  let active = 0;
  let opener: HTMLElement | null = null;
  const viewer = () => document.querySelector<HTMLDialogElement>('[data-viewer]');
  const show = (index: number) => {
    const dialog = viewer();
    if (!dialog || !shots.length) return;
    active = (index + shots.length) % shots.length;
    const image = dialog.querySelector<HTMLImageElement>('[data-viewer-image]')!;
    image.srcset = shots[active].srcset;
    image.sizes = '100vw';
    image.src = shots[active].src;
    image.alt = shots[active].alt;
    dialog.querySelector('[data-viewer-caption]')!.textContent = shots[active].alt;
    dialog.querySelector('[data-viewer-count]')!.textContent = `${active + 1} / ${shots.length}`;
    dialog.querySelectorAll<HTMLElement>('[data-viewer-prev],[data-viewer-next]').forEach(button => (button.hidden = shots.length < 2));
  };
  const openViewer = (item: HTMLElement) => {
    const group = item.closest('[data-gallery]');
    const dialog = viewer();
    if (!group || !dialog) return;
    const items = [...group.querySelectorAll<HTMLElement>('[data-gallery-item]')];
    shots = items.map(entry => ({src: entry.dataset.full || '', srcset: entry.dataset.srcset || '', alt: entry.dataset.alt || ''}));
    opener = item;
    show(items.indexOf(item));
    dialog.showModal();
    lenis?.stop();
  };

  on('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const openButton = target.closest('[data-menu-open]');
    if (openButton) return openMenu(openButton);
    if (target.closest('[data-menu-close]') || target === menu()) return closeMenu();
    if (target.closest('[data-pending]')) {
      event.preventDefault();
      return notify(t('This link is not connected yet: its destination has not been supplied.'));
    }
    const shot = target.closest<HTMLElement>('[data-gallery-item]');
    if (shot) return openViewer(shot);
    if (target.closest('[data-viewer-close]') || target === viewer()) return viewer()?.close();
    if (target.closest('[data-viewer-prev]')) return show(active - 1);
    if (target.closest('[data-viewer-next]')) return show(active + 1);
  });
  on('keydown', event => {
    if (viewer()?.open && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) show(active + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  on('cancel', event => {
    if (event.target === menu()) {event.preventDefault(); closeMenu();}
  }, {capture: true});
  on('close', event => {
    if (event.target === viewer()) {lenis?.start(); opener?.focus();}
  }, {capture: true});
  let touchX = 0;
  on('touchstart', event => {if ((event.target as Element).closest?.('[data-viewer-stage]')) touchX = event.changedTouches[0].clientX;}, {passive: true});
  on('touchend', event => {
    if (!(event.target as Element).closest?.('[data-viewer-stage]')) return;
    const dx = event.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) show(active + (dx < 0 ? 1 : -1));
  }, {passive: true});
  // Menu: pointing at a chapter shows its picture.
  on('pointerover', event => {
    const link = (event.target as Element).closest?.<HTMLElement>('[data-preview]');
    if (!link) return;
    document.querySelectorAll('.menu-shot').forEach(shot => shot.classList.toggle('active', (shot as HTMLElement).dataset.shot === link.dataset.preview));
  });
  on('focusin', event => {
    const link = (event.target as Element).closest?.<HTMLElement>('[data-preview]');
    if (link) document.querySelectorAll('.menu-shot').forEach(shot => shot.classList.toggle('active', (shot as HTMLElement).dataset.shot === link.dataset.preview));
  });

  return {
    closeOverlays() {closeMenu(true); viewer()?.close();},
    destroy() {controller.abort(); window.clearTimeout(toastTimer);}
  };
}

/** Wrap each word of an element in a span, keeping inline marks such as <em>. */
function words(element: HTMLElement) {
  if (element.dataset.words) return [...element.querySelectorAll<HTMLElement>('.w')];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const parts = node.textContent!.split(/(\s+)/);
    const fragment = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) fragment.append(part);
      else {const span = document.createElement('span'); span.className = 'w'; span.textContent = part; fragment.append(span);}
    }
    node.replaceWith(fragment);
  }
  element.dataset.words = 'true';
  return [...element.querySelectorAll<HTMLElement>('.w')];
}

/** Scroll scenes for one page. Returns a cleanup. */
export function scenes(root: HTMLElement) {
  const header = root.querySelector<HTMLElement>('[data-header]');
  const still = reduced();
  const io = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const video = entry.target as HTMLVideoElement;
      if (entry.isIntersecting && !reduced() && !document.hidden) video.play().catch(() => {});
      else video.pause();
    }
  }, {threshold: 0.05});
  root.querySelectorAll<HTMLVideoElement>('video[data-loop]').forEach(video => {video.muted = true; io.observe(video);});
  const visibility = () => root.querySelectorAll<HTMLVideoElement>('video[data-loop]').forEach(video => document.hidden && video.pause());
  document.addEventListener('visibilitychange', visibility);

  const media = gsap.matchMedia();
  const theme = (tone: string) => header?.setAttribute('data-theme', tone === 'forest' || tone === 'petrol' || tone === 'night' ? 'dark' : 'light');
  const context = gsap.context(() => {
    // Header: hides while reading down, returns on the way up, takes the colour under it.
    let last = 0;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => {
        const y = self.scroll();
        header?.classList.toggle('scrolled', y > 40);
        if (!root.querySelector('#site-menu[open]')) header?.classList.toggle('away', y > 320 && y > last + 2);
        if (y < last - 2) header?.classList.remove('away');
        last = y;
        root.querySelector<HTMLElement>('[data-progress]')?.style.setProperty('--progress', String(self.progress));
      }
    });
    root.querySelectorAll<HTMLElement>('section[data-tone]').forEach(section => {
      ScrollTrigger.create({trigger: section, start: 'top 36px', end: 'bottom 36px', onToggle: self => self.isActive && theme(section.dataset.tone || 'paper')});
    });

    // Hero: the arch opens until the picture fills the screen.
    const hero = root.querySelector<HTMLElement>('[data-hero]');
    if (hero && !still) {
      hero.classList.add('opens');
      gsap.to(hero, {
        '--open': 1, ease: 'none',
        scrollTrigger: {trigger: hero.parentElement, start: 'top top', end: 'bottom bottom', scrub: 0.6,
          onUpdate: self => self.progress > 0.55 ? header?.setAttribute('data-theme', 'dark') : theme(hero.closest('section')?.dataset.tone || 'paper')}
      });
    }
    if (hero) theme(hero.closest('section')?.dataset.tone || 'paper');

    if (still) return;

    // Depth: pictures drift a little slower than the page.
    root.querySelectorAll<HTMLElement>('[data-depth]').forEach(frame => {
      const media = frame.querySelector('img,video');
      if (!media) return;
      gsap.fromTo(media, {yPercent: -5, scale: 1.1}, {yPercent: 5, scale: 1.1, ease: 'none', scrollTrigger: {trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true}});
    });

    // Statements brighten word by word as they are read.
    root.querySelectorAll<HTMLElement>('.statement-text').forEach(text => {
      const list = words(text);
      gsap.fromTo(list, {opacity: 0.18}, {opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: {trigger: text, start: 'top 82%', end: 'bottom 45%', scrub: 0.4}});
    });

    // A rail of doors walks sideways on wide screens.
    media.add('(min-width: 1024px)', () => {
      root.querySelectorAll<HTMLElement>('[data-rail]').forEach(rail => {
        const track = rail.querySelector<HTMLElement>('[data-track] ul');
        if (!track) return;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);
        gsap.to(track, {x: () => -distance(), ease: 'none', scrollTrigger: {trigger: rail.querySelector('[data-track]'), start: 'center center', end: () => `+=${distance()}`, pin: rail, scrub: 0.5, invalidateOnRefresh: true}});
      });
      // Steps: the picture stays and changes with the step being read.
      root.querySelectorAll<HTMLElement>('[data-steps]').forEach(block => {
        const shots = block.querySelectorAll<HTMLElement>('[data-shot]');
        block.querySelectorAll<HTMLElement>('[data-step]').forEach(step => {
          ScrollTrigger.create({trigger: step, start: 'top 60%', end: 'bottom 60%', onToggle: self => {
            if (!self.isActive) return;
            shots.forEach(shot => shot.classList.toggle('active', shot.dataset.shot === step.dataset.step));
            block.querySelectorAll('[data-step]').forEach(other => other.classList.toggle('current', other === step));
          }});
        });
      });
    });
  }, root);

  let refresh = 0;
  const later = () => {window.clearTimeout(refresh); refresh = window.setTimeout(() => ScrollTrigger.refresh(), 160);};
  requestAnimationFrame(later);
  root.querySelectorAll('img').forEach(image => image.complete || image.addEventListener('load', later, {once: true}));
  document.fonts?.ready.then(later);

  return () => {
    window.clearTimeout(refresh);
    media.revert();
    context.revert();
    io.disconnect();
    document.removeEventListener('visibilitychange', visibility);
  };
}
