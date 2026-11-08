// One delegated controller survives SvelteKit page changes. Abort on unmount.
let resetPendingMenu = () => {};
export function closeOverlays() {
  resetPendingMenu();
  document.querySelectorAll('.preview-toast').forEach(toast => toast.hidden = true);
  document.querySelectorAll('[data-menu-open]').forEach(button => button.setAttribute('aria-expanded','false'));
  document.querySelectorAll('dialog').forEach(dialog => {dialog.classList.remove('closing');if(dialog.open)dialog.close();});
  closeMegas();
}

// Step 2.1: the Legacy mega menu panels under the header (components/Header.svelte).
function closeMegas(focusTrigger = false) {
  document.querySelectorAll('[data-mega][data-open="true"]').forEach(panel => {
    panel.dataset.open = 'false';
    panel.inert = true;
    const trigger = document.querySelector(`[data-mega-trigger][aria-controls="${panel.id}"]`);
    trigger?.setAttribute('aria-expanded', 'false');
    if (focusTrigger) trigger?.focus();
  });
  updateHeader();
}
function openMega(trigger, focusFirst) {
  const panel = document.getElementById(trigger.getAttribute('aria-controls') || '');
  if (!panel) return;
  closeMegas();
  panel.dataset.open = 'true';
  panel.inert = false;
  trigger.setAttribute('aria-expanded', 'true');
  trigger.closest('[data-header]')?.classList.remove('is-away');
  updateHeader();
  if (focusFirst) panel.querySelector('a')?.focus();
}

// Step 2.1: the header floats, takes the tone of the section under it, steps away while you read downwards and
// returns on the way up, and shows reading progress (as on /blueprint/ 452c7d0).
const DARK = '[data-role="photo-hero"], [data-role="overlay"], [data-role="gallery"], [data-role="map"], .site-newsletter, .site-footer';
let lastY = 0;
let refreshHeader = () => {};
function toneUnder(header) {
  if (header.querySelector('[data-mega][data-open="true"]')) return 'dark';
  const y = header.offsetHeight / 2;
  const sections = document.querySelectorAll('.current-page > section, .site-footer');
  for (const section of sections) {
    const box = section.getBoundingClientRect();
    if (box.top <= y && box.bottom > y) return section.matches(DARK) ? 'dark' : 'light';
  }
  return header.dataset.theme || 'light';
}
function updateHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const y = scrollY;
  header.classList.toggle('is-scrolled', y > 40);
  const busy = document.querySelector('#site-menu[open]') || header.querySelector('[data-mega][data-open="true"]') || header.contains(document.activeElement);
  if (!busy && y > 320 && y > lastY + 2) header.classList.add('is-away');
  if (busy || y <= 320 || y < lastY - 2) header.classList.remove('is-away');
  lastY = y;
  const max = document.documentElement.scrollHeight - innerHeight;
  header.style.setProperty('--progress', max > 0 ? String(Math.min(1, Math.max(0, y / max))) : '0');
  header.dataset.theme = toneUnder(header);
}

// Card rows that scroll sideways on phones (styles/system.css) take keyboard focus when nothing inside them can.
function markRails() {
  document.querySelectorAll('.current-page [data-part="card-grid"]').forEach(rail => {
    const scrolls = rail.scrollWidth > rail.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(rail).overflowX);
    if (scrolls && !rail.querySelector('a[href], button, input, [tabindex]')) {
      rail.tabIndex = 0;
      rail.setAttribute('role', 'region');
      rail.setAttribute('aria-label', (rail.closest('section')?.querySelector('h2')?.textContent.trim() || 'Cards') + ', scrolls sideways');
    } else if (rail.hasAttribute('tabindex')) {
      rail.removeAttribute('tabindex'); rail.removeAttribute('role'); rail.removeAttribute('aria-label');
    }
  });
}

export function enhancePage() {
  markRails();
  refreshHeader();
  document.querySelectorAll('[data-gallery] img[data-gallery-image]').forEach(img => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-haspopup','dialog');
    img.setAttribute('aria-controls','photo-gallery');
    img.setAttribute('aria-label', 'Open photo gallery');
  });
  document.querySelectorAll('[data-gallery-open]').forEach(button=>{button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','photo-gallery');});
  document.querySelectorAll('a[href]').forEach(link => {
    const url=new URL(link.href,location.href);
    if(!url.hash&&url.origin===location.origin&&url.pathname.replace(/\/$/,'')===location.pathname.replace(/\/$/,''))link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
}

export function installInteractions() {
  const controller = new AbortController();
  const {signal} = controller;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const timeouts = new Set();
  const later = (fn, ms) => {const id = setTimeout(() => {timeouts.delete(id);fn();}, ms);timeouts.add(id);return id;};
  const on = (name, fn, options = {}) => document.addEventListener(name, fn, {...options, signal});
  let opener, galleryOpener, images = [], active = 0, toastTimer, menuCloseTimer, touchX = 0;
  const menu = () => document.querySelector('#site-menu');
  const gallery = () => document.querySelector('.gallery-dialog');

  let railFrame = 0, headerFrame = 0;
  addEventListener('resize', () => {cancelAnimationFrame(railFrame);railFrame = requestAnimationFrame(() => {markRails();updateHeader();});}, {signal});
  addEventListener('scroll', () => {if (!headerFrame) headerFrame = requestAnimationFrame(() => {headerFrame = 0;updateHeader();});}, {passive:true, signal});
  refreshHeader = () => {lastY = scrollY;document.querySelector('[data-header]')?.classList.remove('is-away');updateHeader();};
  on('focusin', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('[data-header]')) document.querySelector('[data-header]')?.classList.remove('is-away');
    if (target && !target.closest('[data-mega], [data-mega-trigger]')) closeMegas();
  });
  resetPendingMenu=()=>{clearTimeout(menuCloseTimer);menuCloseTimer=undefined;menu()?.classList.remove('closing');};
  // Owner's request, 2026-11-07: page text cannot be selected or copied (see also styles/shell-edition.css).
  // Form fields stay editable: their text can be selected, copied, cut and pasted.
  const editable = target => target instanceof Element && !!target.closest('input, textarea, [contenteditable=""], [contenteditable="true"]');
  for (const name of ['selectstart', 'copy', 'cut']) on(name, event => {if (!editable(event.target)) event.preventDefault();}, {capture:true});
  function notify(message) {
    document.querySelectorAll('.preview-toast').forEach(item=>item.hidden=true);
    const toast = menu()?.open ? menu().querySelector('.dialog-toast') : document.querySelector('.preview-toast:not(.dialog-toast)');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = later(() => toast.hidden = true, 5000);
  }
  function closeMenu() {
    const dialog = menu();
    if (!dialog?.open || dialog.classList.contains('closing')) return;
    const finish = () => {menuCloseTimer=undefined;dialog.close();dialog.classList.remove('closing');dialog.querySelectorAll('.preview-toast').forEach(toast=>toast.hidden=true);opener?.setAttribute('aria-expanded','false');if(opener?.isConnected)opener.focus();};
    if (reduced.matches) finish();
    else {dialog.classList.add('closing');menuCloseTimer=later(finish, 300);}
  }
  function show(index) {
    const dialog = gallery();
    if (!dialog || !images.length) return;
    active = (index + images.length) % images.length;
    const photo = dialog.querySelector('.gallery-stage img');
    photo.src = images[active].src;
    photo.alt = images[active].alt;
    dialog.querySelector('.gallery-count').textContent = `${active + 1} / ${images.length}`;
    dialog.querySelectorAll('.gallery-arrow,.gallery-edge').forEach(button => button.hidden = images.length < 2);
    dialog.querySelector('.gallery-thumbnails').hidden = images.length < 2;
    dialog.querySelectorAll('[data-gallery-index]').forEach(button => button.setAttribute('aria-current', String(Number(button.dataset.galleryIndex) === active)));
  }
  function openGallery(group, selected, trigger) {
    const dialog = gallery();
    if (!dialog || !group) return;
    images = [...group.querySelectorAll('img[data-gallery-image]')].map(img => ({src:img.currentSrc || img.src, alt:img.alt})).filter((entry,index,all) => all.findIndex(other => other.src === entry.src) === index);
    if (!images.length) return;
    galleryOpener = trigger;
    dialog.querySelector('.gallery-thumbnails').replaceChildren(...images.map((entry,index) => {
      const button = document.createElement('button');
      button.type = 'button';button.dataset.galleryIndex = String(index);button.setAttribute('aria-label', `View photo ${index + 1}`);
      const image = new Image();image.src = entry.src;image.alt = '';button.append(image);
      return button;
    }));
    show(Math.max(0, images.findIndex(image => image.src === selected)));
    dialog.showModal();
  }
  on('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const megaTrigger = target.closest('[data-mega-trigger]');
    if (megaTrigger) {if (megaTrigger.getAttribute('aria-expanded') === 'true') closeMegas(); else openMega(megaTrigger, false);return;}
    if (!target.closest('[data-mega]')) closeMegas();
    const open = target.closest('[data-menu-open]');
    if (open) {resetPendingMenu();opener=open;const dialog=menu();if(dialog&&!dialog.open){dialog.showModal();dialog.scrollTop=0;open.setAttribute('aria-expanded','true');dialog.querySelector('[data-menu-close]')?.focus();}return;}
    if(target===menu()){const box=target.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom){closeMenu();return;}}
    if (target.closest('[data-menu-close]')) {closeMenu();return;}
    if (target.closest('[data-language-trigger]')) {notify('This preview is in English. Localized page copy has not been supplied yet.');return;}
    if (target.closest('[data-pending-link]')) {event.preventDefault();notify('This destination is still a placeholder in the supplied design.');return;}
    if (target.closest('.gallery-close')) {gallery()?.close();return;}
    if (target.closest('.gallery-prev,.gallery-edge.left')) {show(active - 1);return;}
    if (target.closest('.gallery-next,.gallery-edge.right')) {show(active + 1);return;}
    const thumbnail = target.closest('[data-gallery-index]');
    if (thumbnail) {show(Number(thumbnail.dataset.galleryIndex));return;}
    const galleryTrigger = target.closest('[data-gallery-open],img[data-gallery-image]');
    if (galleryTrigger) {openGallery(galleryTrigger.closest('[data-gallery]'), galleryTrigger.currentSrc || galleryTrigger.src, galleryTrigger);return;}
  });
  on('cancel', event => {if (event.target === menu()) {event.preventDefault();closeMenu();}}, {capture:true});
  on('close', event => {if (event.target === gallery()) galleryOpener?.focus();}, {capture:true});
  on('keydown', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (gallery()?.open && ['ArrowLeft','ArrowRight'].includes(event.key)) {event.preventDefault();show(active + (event.key === 'ArrowLeft' ? -1 : 1));return;}
    // Mega menu keys, as in the Legacy Blueprint: Arrow Down (or Tab on an open trigger) enters the panel, Escape
    // closes it and returns to the trigger, Shift+Tab from the first card goes back, Tab from Overview moves on.
    const megaTrigger = target?.closest('[data-mega-trigger]');
    if (megaTrigger && (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey && megaTrigger.getAttribute('aria-expanded') === 'true'))) {event.preventDefault();openMega(megaTrigger, true);return;}
    if (event.key === 'Escape' && document.querySelector('[data-mega][data-open="true"]')) {event.preventDefault();closeMegas(true);return;}
    const panel = target?.closest('[data-mega]');
    if (panel && event.key === 'Tab') {
      const links = [...panel.querySelectorAll('a')];
      const trigger = document.querySelector(`[data-mega-trigger][aria-controls="${panel.id}"]`);
      if (event.shiftKey && target === links[0]) {event.preventDefault();trigger?.focus();return;}
      if (!event.shiftKey && target === links.at(-1)) {
        event.preventDefault();
        const triggers = [...document.querySelectorAll('[data-mega-trigger]')];
        const next = triggers[triggers.indexOf(trigger) + 1] || document.querySelector('[data-header] .brand');
        closeMegas();next?.focus();return;
      }
    }
    if (['Enter',' '].includes(event.key) && target?.matches('img[data-gallery-image]')) {event.preventDefault();openGallery(target.closest('[data-gallery]'), target.currentSrc || target.src, target);}
  });
  on('touchstart', event => {if (event.target.closest('.gallery-stage')) touchX = event.changedTouches[0].clientX;}, {passive:true});
  on('touchend', event => {if (event.target.closest('.gallery-stage')) {const dx = event.changedTouches[0].clientX - touchX;if (Math.abs(dx) > 45) show(active + (dx < 0 ? 1 : -1));}}, {passive:true});
  enhancePage();
  return () => {controller.abort();timeouts.forEach(clearTimeout);cancelAnimationFrame(headerFrame);resetPendingMenu=()=>{};refreshHeader=()=>{};};
}
