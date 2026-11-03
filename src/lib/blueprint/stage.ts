// The stage: one fixed canvas behind the page that shows the place the reader is in. Sheets of
// paper or night slide over it; between them the place shows through. Each place is drawn in a
// single WebGL pass: the picture, the place's word behind its subject (the subject's matte hides
// the word), mist while the place surfaces, and a fine grain. The pointer moves the picture and the
// word at different depths. Without WebGL, and under reduced motion, plain layers stand in.
import {places, isFilm, type PlaceName, type Variant} from './stages.ts';

const VERT = `attribute vec2 p; varying vec2 vUv; void main() { vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `precision highp float;
varying vec2 vUv;
uniform sampler2D uImg; uniform sampler2D uWord;
uniform vec2 uRes; uniform vec4 uCover; uniform float uStack; uniform float uEdge;
uniform vec4 uWordRect; uniform vec3 uWordColor; uniform float uShade; uniform float uWordOn; uniform float uSky; uniform float uDim;
uniform float uFog; uniform float uTime;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
// The picture and its matte share one texture: side by side (films) or one above the other (stills).
vec4 pic(vec2 uv) {
  if (uStack < 0.5) {
    float x = clamp(uv.x, uEdge, 1.0 - uEdge) * 0.5;
    return vec4(texture2D(uImg, vec2(x, uv.y)).rgb, texture2D(uImg, vec2(x + 0.5, uv.y)).r);
  }
  float y = clamp(uv.y, uEdge, 1.0 - uEdge) * 0.5;
  return vec4(texture2D(uImg, vec2(uv.x, y)).rgb, texture2D(uImg, vec2(uv.x, y + 0.5)).r);
}
void main() {
  vec2 s = vec2(vUv.x, 1.0 - vUv.y);
  vec2 uv = s * uCover.xy + uCover.zw;
  vec4 c = pic(uv);
  if (uFog > 0.002) {
    float r = uFog * 0.01;
    vec4 b = c + pic(uv + vec2(r, 0.0)) + pic(uv - vec2(r, 0.0)) + pic(uv + vec2(0.0, r * 1.7)) + pic(uv - vec2(0.0, r * 1.7));
    c = mix(c, b / 5.0, min(1.0, uFog * 2.0));
  }
  vec2 px = s * uRes;
  vec2 w = (px - uWordRect.xy) / uWordRect.zw;
  vec4 word = (w.x >= 0.0 && w.y >= 0.0 && w.x <= 1.0 && w.y <= 1.0) ? texture2D(uWord, w) : vec4(0.0);
  vec3 col = mix(c.rgb, pow(c.rgb, vec3(1.7)) * 1.04, uSky * (1.0 - c.a));
  col *= mix(1.0, uDim, 1.0 - c.a);
  float behind = (1.0 - c.a) * uWordOn;
  col *= 1.0 - uShade * word.r * behind;
  col = mix(col, uWordColor, word.a * behind);
  if (uFog > 0.002) {
    float n = fbm(s * vec2(2.4, 3.2) + vec2(uTime * 0.018, uTime * 0.009));
    col = mix(col, vec3(0.88, 0.885, 0.875), smoothstep(0.0, 1.0, uFog * 1.4 - n * 0.4));
  }
  col *= 1.0 - 0.22 * smoothstep(0.8, 1.0, vUv.y);
  col += (hash(px + fract(uTime) * 97.0) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}`;

type Layout = {sx: number; sy: number; ox: number; oy: number};
type Rect = {x: number; y: number; w: number; h: number};
type Entry = {
  name: PlaceName; opener: HTMLElement; layer: HTMLElement | null;
  film: boolean; word?: string;
  /** The crop and the file this place was last loaded for; a resize reloads only when the file changes. */
  variant?: Variant; src?: string; ready: boolean; loading?: Promise<void>;
  texture?: WebGLTexture; video?: HTMLVideoElement; wordTex?: {tex: WebGLTexture; aspect: number};
  /** Where the letters sit inside the word's texture. */
  inner?: Rect;
  /** A film's next frame is waiting to be uploaded (undefined: the browser does not report frames). */
  fresh?: boolean; watching?: boolean;
};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => 1 - Math.pow(1 - x, 3);
/** The canvas draws at most this many pixels; past it the picture holds no more detail. */
const BUDGET = 6e6;

/** Where the picture lies on the screen under a cover crop. */
export function cover(W: number, H: number, v: Variant, zoom = 1, shiftX = 0, shiftY = 0): Layout {
  const ia = v.w / v.h, sa = W / H;
  let sx = sa > ia ? 1 : sa / ia, sy = sa > ia ? ia / sa : 1;
  sx /= zoom; sy /= zoom;
  const ox = clamp((1 - sx) * v.focus[0] + shiftX * sx, 0, 1 - sx);
  const oy = clamp((1 - sy) * v.focus[1] + shiftY * sy, 0, 1 - sy);
  return {sx, sy, ox, oy};
}

/** The word's rectangle on screen, in CSS pixels, from its place in the picture. Its capitals stand
 *  at the composed height; the word then stays inside the screen's margins and below the header: a
 *  word composed beside its subject (hold) keeps its near edge and narrows, any other word moves in.
 *  aspect is the letters' height over their width. */
export function wordRect(W: number, H: number, v: Variant, l: Layout, aspect: number, top: number): Rect {
  const [cx, cy, cap] = v.word;
  const margin = Math.max(16, W * 0.03);
  let h = cap * H / l.sy, w = h / aspect;
  let x = (cx - l.ox) / l.sx * W - w / 2;
  const middle = (cy - l.oy) / l.sy * H;
  if (v.hold && x >= margin && x + w > W - margin) w = W - margin - x;
  w = Math.min(w, W - margin * 2);
  h = w * aspect;
  x = clamp(v.hold ? x : (cx - l.ox) / l.sx * W - w / 2, margin, W - margin - w);
  const y = Math.max(middle - h / 2, top);
  return {x, y, w, h};
}

/** The word as a texture: the letters in alpha, a soft halo of them in red for the shade behind.
 *  The halo is a shadow cast from letters drawn off the canvas (canvas filters are not everywhere),
 *  and the padding holds three times its spread, so it fades out before the texture's edge. */
function drawWord(text: string, family: string) {
  const size = 420, soft = size * 0.16, pad = Math.ceil(soft * 3);
  const probe = document.createElement('canvas').getContext('2d')!;
  const font = `440 ${size}px ${family}`;
  probe.font = font;
  const spacing = size * 0.035;
  const letters = [...text];
  const widths = letters.map(ch => probe.measureText(ch).width);
  const width = widths.reduce((a, b) => a + b, 0) + spacing * (letters.length - 1);
  const m = probe.measureText(text);
  const ascent = m.actualBoundingBoxAscent, descent = m.actualBoundingBoxDescent;
  const W = Math.ceil(width + pad * 2), H = Math.ceil(ascent + descent + pad * 2);
  const paint = (blur: number) => {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d')!;
    g.font = font; g.fillStyle = '#fff'; g.textBaseline = 'alphabetic';
    // A shadow's blur is twice its standard deviation.
    const away = blur ? W + 100 : 0;
    if (blur) {g.shadowColor = '#fff'; g.shadowBlur = blur * 2; g.shadowOffsetX = away;}
    let x = pad - away;
    letters.forEach((ch, i) => {g.fillText(ch, x, pad + ascent); x += widths[i] + spacing;});
    return g.getImageData(0, 0, W, H).data;
  };
  const sharp = paint(0), halo = paint(soft);
  const data = new Uint8Array(W * H * 4);
  for (let i = 0; i < W * H; i++) {data[i * 4] = halo[i * 4 + 3]; data[i * 4 + 3] = sharp[i * 4 + 3];}
  return {data, W, H, inner: {x: pad, y: pad, w: width, h: ascent + descent}};
}

/** A still, decoded off the main thread where the browser can; older browsers get a plain image. */
async function decode(src: string): Promise<ImageBitmap | HTMLImageElement> {
  const response = await fetch(src);
  if (!response.ok) throw new Error(`${src}: ${response.status}`);
  const blob = await response.blob();
  try {return await createImageBitmap(blob, {colorSpaceConversion: 'none'});}
  catch {
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    await img.decode();
    return img;
  }
}

export function stage(root: HTMLElement) {
  const host = root.querySelector<HTMLElement>('[data-stage]');
  const canvas = host?.querySelector<HTMLCanvasElement>('[data-stage-canvas]');
  if (!host || !canvas) return () => {};
  const header = root.querySelector<HTMLElement>('[data-header]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let alive = true;
  // The word as the page wrote it, in the page's language.
  const entries: Entry[] = [...root.querySelectorAll<HTMLElement>('[data-opener]')].map(opener => {
    const name = opener.dataset.opener as PlaceName;
    const layer = host.querySelector<HTMLElement>(`[data-place="${name}"]`);
    const film = isFilm(places[name]);
    return {name, opener, layer, film, word: film ? undefined : layer?.querySelector('[data-word]')?.textContent?.trim() || name, ready: false};
  });
  if (!entries.length) return () => {};
  let gl = reduced ? null : canvas.getContext('webgl', {antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance'});
  // The same test as the plain layers' media query.
  const upright = matchMedia('(max-aspect-ratio: 9/10)');
  const pick = (e: Entry) => {
    const place = places[e.name];
    return isFilm(place) ? undefined : upright.matches ? place.phone : place.desktop;
  };
  // The stage's own size: the screen without a scrollbar.
  const size = () => ({W: host.clientWidth || innerWidth, H: host.clientHeight || innerHeight});
  // A crop's file: its larger one where the screen would enlarge the regular one by more than a fifth.
  const source = (v: Variant) => {
    if (!v.large) return v.src;
    const {W, H} = size();
    return Math.max(W / v.w, H / v.h) * Math.min(devicePixelRatio || 1, 2) * 1.05 > 1.2 ? v.large : v.src;
  };
  const headerHeight = () => (header?.querySelector('.header-inner') as HTMLElement | null)?.offsetHeight || 76;
  const idle = (fn: () => void) => ((window as Window & {requestIdleCallback?: (fn: () => void) => number}).requestIdleCallback || ((f: () => void) => window.setTimeout(f, 1200)))(() => {if (alive) fn();});

  // The plain layers: they need their pictures only without the canvas.
  const goFlat = () => {
    if (!alive) return;
    gl = null;
    host.classList.add('flat');
    host.classList.remove('drawn');
    host.querySelectorAll<HTMLElement>('[data-src], [data-srcset]').forEach(el => {
      if (el.dataset.srcset) el.setAttribute('srcset', el.dataset.srcset);
      if (el.dataset.src) el.setAttribute('src', el.dataset.src);
    });
    entries.forEach(e => e.video?.pause());
    if (active) layoutFlat(active);
    wake();
  };

  const u: Record<string, WebGLUniformLocation | null> = {};
  if (gl) {
    const shader = (type: number, src: string) => {const s = gl!.createShader(type)!; gl!.shaderSource(s, src); gl!.compileShader(s); return s;};
    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) gl = null;
    else {
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      for (const name of ['uImg', 'uWord', 'uRes', 'uCover', 'uStack', 'uEdge', 'uWordRect', 'uWordColor', 'uShade', 'uWordOn', 'uSky', 'uDim', 'uFog', 'uTime']) u[name] = gl.getUniformLocation(program, name);
      gl.uniform1i(u.uImg, 0);
      gl.uniform1i(u.uWord, 1);
      gl.uniform3f(u.uWordColor, 0.961, 0.922, 0.906);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.clearColor(0.055, 0.059, 0.059, 1);
    }
  }
  // A lost context (the GPU reset, too many pages open) leaves the plain layers in its place.
  const onLost = (event: Event) => {event.preventDefault(); goFlat();};
  canvas.addEventListener('webglcontextlost', onLost);

  const texture = () => {
    const t = gl!.createTexture()!;
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, t);
    for (const [k, v] of [[gl!.TEXTURE_MIN_FILTER, gl!.LINEAR], [gl!.TEXTURE_MAG_FILTER, gl!.LINEAR], [gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE], [gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE]]) gl!.texParameteri(gl!.TEXTURE_2D, k, v);
    return t;
  };

  // Load a place for the current crop: its picture with its matte (a film, or a still) and its word. A place already loaded for this crop is left as it is.
  const family = getComputedStyle(root).getPropertyValue('--serif') || 'serif';
  const load = (e: Entry): Promise<void> => {
    if (!gl || e.film) return Promise.resolve();
    const v = pick(e)!, src = source(v);
    if (e.src === src && (e.ready || e.loading)) return e.loading || Promise.resolve();
    e.variant = v;
    e.src = src;
    e.ready = false;
    const job = (async () => {
      if (src.endsWith('.mp4')) {
        const video = e.video || document.createElement('video');
        // Attributes as well as properties: iOS reads them before it allows inline, silent play.
        video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
        video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'auto';
        if (video.getAttribute('src') !== src) video.src = src;
        e.video = video;
        // iOS may hold back the first frame of a film outside the page until it is asked to play.
        video.play().catch(() => {});
        await new Promise<void>((resolve, reject) => {
          if (video.readyState >= 2) return resolve();
          video.addEventListener('loadeddata', () => resolve(), {once: true});
          video.addEventListener('error', () => reject(new Error(`${src}: cannot play`)), {once: true});
        });
        if (e !== active) video.pause();
        if (!alive || !gl || e.src !== src) return;
        // Upload a frame only when the film has a new one, where the browser reports frames.
        if (!e.watching && 'requestVideoFrameCallback' in video) {
          e.watching = true;
          const next = () => {e.fresh = true; if (alive) video.requestVideoFrameCallback(next);};
          video.requestVideoFrameCallback(next);
        }
        e.texture = e.texture || texture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, e.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      } else {
        const picture = await decode(src);
        if (!alive || !gl || e.src !== src) return;
        e.texture = e.texture || texture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, e.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, picture);
        if ('close' in picture) picture.close(); else URL.revokeObjectURL(picture.src);
      }
      if (!e.wordTex) {
        await document.fonts.load(`440 100px ${family}`).catch(() => {});
        if (!alive || !gl) return;
        if (!e.wordTex) {
          const w = drawWord(e.word!.toUpperCase(), family);
          const tex = texture();
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w.W, w.H, 0, gl.RGBA, gl.UNSIGNED_BYTE, w.data);
          e.wordTex = {tex, aspect: w.H / w.W};
          e.inner = w.inner;
        }
      }
      if (e.src === src) e.ready = true;
      wake();
    })().finally(() => {if (e.loading === job) e.loading = undefined;});
    e.loading = job;
    return job;
  };
  // A place that cannot be drawn hands the whole stage to the plain layers.
  const fetchPlace = (e: Entry) => load(e).catch(error => {console.warn('Stage: showing plain layers,', error); goFlat();});

  // State that follows the reader.
  let active: Entry | undefined;
  let raf = 0, nextTry = 0;
  const start = performance.now();
  const pointer = {x: 0, y: 0, tx: 0, ty: 0};
  let intro = reduced ? 0 : 1;
  const introDelay = document.documentElement.dataset.intro === 'on' ? 2600 : 200;

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    pointer.tx = event.clientX / innerWidth - 0.5;
    pointer.ty = event.clientY / innerHeight - 0.5;
    wake();
  };

  function layoutFlat(e: Entry) {
    // The plain layers: the same crop by CSS, the word placed by the same rule as on the canvas.
    if (!e.layer || e.film) return;
    const v = pick(e)!;
    const word = e.layer.querySelector<HTMLElement>('[data-word]');
    if (!word) return;
    const {W, H} = size();
    // Capitals of the antiqua are about 0.68 of the size high and 0.8 wide.
    const r = wordRect(W, H, v, cover(W, H, v), 0.68 / (e.word!.length * 0.8), headerHeight() + 12);
    word.style.cssText = `left:${r.x}px;top:${r.y}px;width:${r.w}px;font-size:${r.h / 0.68}px`;
  }

  const filmVideo = host.querySelector<HTMLVideoElement>('[data-film-video]');
  const filmOpener = root.querySelector<HTMLElement>('[data-opener] [data-film-play]')?.closest<HTMLElement>('[data-opener]');

  const frame = (now: number) => {
    raf = 0;
    if (!alive) return;
    const screen = innerHeight;
    // The place is the last opener that has come into view; while a sheet covers the screen the
    // stage can change place unseen, and the next place is there when the sheet ends.
    const rects = entries.map(e => e.opener.getBoundingClientRect());
    let index = 0;
    rects.forEach((r, i) => {if (r.top < screen) index = i;});
    const next = entries[index];
    if (next !== active) {
      entries.forEach(e => e.layer?.classList.toggle('on', e === next));
      active?.video?.pause();
      // Leaving the film stops it, sound and all; it does not start again by itself.
      if (active?.film) filmVideo?.pause();
      active = next;
      host.classList.toggle('showing-film', active.film);
      fetchPlace(active);
      layoutFlat(active);
    }
    const rect = rects[index];
    const visible = rects.some(r => r.bottom > 0 && r.top < screen);
    // Over the stage the header stays clear, without its ground.
    if (header) {const over = rects.some(r => r.top <= 38 && r.bottom >= 38) ? 'stage' : ''; if (header.dataset.over !== over) header.dataset.over = over;}
    const t = (now - start) / 1000;
    if (intro > 0 && now - start > introDelay) intro = Math.max(0, 1 - (now - start - introDelay) / 2200);
    const entering = active === entries[0] ? 1 - intro : ease(clamp((screen - rect.top) / (screen * 0.75)));
    const fog = reduced ? 0 : 1 - entering;
    const progress = clamp(-rect.top / screen, -1, 1.3);
    host.style.setProperty('--fog', fog.toFixed(3));
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    const settling = Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.0005;
    // A film that will not start (low power mode, autoplay off) is asked again once a second, not every frame.
    const tryPlay = (video: HTMLVideoElement) => {if (now > nextTry) {nextTry = now + 1000; video.play().catch(() => {});}};

    if (active.film) {
      // The preview plays while in view until someone opens the film; then only its controls play it.
      if (filmVideo && visible && !reduced && !filmOpener?.classList.contains('activated') && filmVideo.paused) tryPlay(filmVideo);
      if (filmVideo && !visible && !filmVideo.paused) filmVideo.pause();
    } else if (active.video && !visible && !active.video.paused) active.video.pause();
    else if (gl && visible) {
      const e = active;
      if (!e.ready || !e.texture || !e.wordTex || !e.inner || !e.variant) {
        // Not loaded for this crop yet: the stage stays dark rather than show the place before.
        if (host.classList.contains('drawn')) {gl.clear(gl.COLOR_BUFFER_BIT); host.classList.remove('drawn');}
      } else {
        const v = e.variant;
        const video = e.video;
        if (video) {
          if (video.paused && !reduced) tryPlay(video);
          if (video.readyState >= 2 && !video.paused && e.fresh !== false) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, e.texture);
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, video);
            if (e.fresh) e.fresh = false;
          }
        }
        const {W, H} = size();
        const dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt(BUDGET / (W * H)));
        const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
        if (canvas.width !== cw || canvas.height !== ch) {canvas.width = cw; canvas.height = ch; gl.viewport(0, 0, cw, ch);}
        // A still breathes: an eased push toward its subject and back, sixteen seconds each way.
        const breath = video ? 0 : 0.5 - 0.5 * Math.cos(t * Math.PI / 16);
        const zoom = 1.05 + 0.025 * breath;
        const l = cover(W, H, v, zoom, pointer.x * 0.035, pointer.y * 0.025);
        const inner = e.inner, tex = e.wordTex;
        // The word sits by its letters, not by the texture's padding.
        const box = wordRect(W, H, v, l, inner.h / inner.w, headerHeight() + 12);
        const scale = box.w / inner.w;
        const lift = reduced ? 0 : -progress * screen * 0.16;
        const wx = box.x - inner.x * scale - pointer.x * 16;
        const wy = box.y - inner.y * scale + lift - pointer.y * 10;
        const tw = (inner.w + inner.x * 2) * scale;
        gl.uniform2f(u.uRes, cw, ch);
        gl.uniform4f(u.uCover, l.sx, l.sy, l.ox, l.oy);
        gl.uniform1f(u.uStack, v.pack === 'stack' ? 1 : 0);
        // Keep a pixel away from the seam between picture and matte.
        gl.uniform1f(u.uEdge, v.pack === 'stack' ? 1 / v.h : 1 / v.w);
        gl.uniform4f(u.uWordRect, wx * dpr, wy * dpr, tw * dpr, tw * tex.aspect * dpr);
        const place = places[e.name] as {shade: number; sky: number};
        gl.uniform1f(u.uShade, place.shade);
        gl.uniform1f(u.uSky, place.sky);
        gl.uniform1f(u.uDim, v.dim ?? 1);
        gl.uniform1f(u.uWordOn, 1 - fog);
        gl.uniform1f(u.uFog, fog);
        gl.uniform1f(u.uTime, t);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, e.texture);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex.tex);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        host.classList.add('drawn');
        // For checks: where the word stands with the page at rest (the pointer moves it a little).
        if (Math.abs(rect.top) < 1) host.dataset.word = `${Math.round(box.x)},${Math.round(box.y)},${Math.round(box.w)},${Math.round(box.h)}`;
      }
    }
    // Keep drawing while the stage is in view; sleep while sheets cover it.
    if ((visible || intro > 0 || settling) && !document.hidden) raf = requestAnimationFrame(frame);
  };
  function wake() {if (!raf && alive) raf = requestAnimationFrame(frame);}

  // Film place: a quiet preview while it is on screen; a tap starts the film from the beginning
  // with sound; then pause and sound controls appear, and the film no longer plays on its own: it
  // stops at its end and waits (the legacy Blueprint film behaviour).
  const toggle = filmOpener?.querySelector<HTMLElement>('[data-film-toggle]');
  const mute = filmOpener?.querySelector<HTMLElement>('[data-film-mute]');
  const syncFilm = () => {
    if (!filmVideo) return;
    const playing = !filmVideo.paused;
    if (toggle) {toggle.dataset.playing = String(playing); toggle.setAttribute('aria-label', (playing ? toggle.dataset.labelPause : toggle.dataset.labelPlay) || '');}
    mute?.setAttribute('aria-pressed', String(filmVideo.muted));
  };
  const onClick = (event: MouseEvent) => {
    const target = event.target as Element;
    if (!filmVideo || !filmOpener || !filmOpener.contains(target)) return;
    if (target.closest('[data-film-play]')) {
      filmVideo.src = filmVideo.dataset.full!;
      filmVideo.muted = false; filmVideo.loop = false;
      filmVideo.play().catch(() => {});
      filmOpener.classList.add('activated');
      // The play button gives way to the controls; focus moves with it.
      toggle?.focus();
    } else if (target.closest('[data-film-toggle]')) {
      if (filmVideo.paused) {if (filmVideo.ended) filmVideo.currentTime = 0; filmVideo.play().catch(() => {});} else filmVideo.pause();
    } else if (target.closest('[data-film-mute]')) filmVideo.muted = !filmVideo.muted;
  };
  const filmEvents = ['play', 'pause', 'ended', 'volumechange'];
  filmEvents.forEach(name => filmVideo?.addEventListener(name, syncFilm));

  // A resize reloads a place only when its file changes (a phone turned, a window made upright or
  // much larger): the place on screen at once, the others when the browser is idle.
  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (gl) {
        const changed = entries.filter(e => !e.film && e.src && e.src !== source(pick(e)!));
        changed.forEach(e => {e.ready = false;});
        if (active && changed.includes(active)) fetchPlace(active);
        if (changed.length) idle(() => changed.forEach(fetchPlace));
      }
      if (active) layoutFlat(active);
      wake();
    }, 120);
    wake();
  };
  // A hidden tab stops the silent films; the film someone chose to watch plays on.
  const onVisibility = () => {
    if (document.hidden) {
      entries.forEach(e => e.video?.pause());
      if (!filmOpener?.classList.contains('activated')) filmVideo?.pause();
    }
    wake();
  };
  const onScroll = () => wake();
  addEventListener('scroll', onScroll, {passive: true});
  addEventListener('resize', onResize);
  addEventListener('pointermove', onPointer, {passive: true});
  root.addEventListener('click', onClick);
  document.addEventListener('visibilitychange', onVisibility);
  if (!gl) goFlat();
  else {
    // The first place now; the others when the browser is idle.
    fetchPlace(entries[0]);
    idle(() => entries.slice(1).forEach(fetchPlace));
  }
  wake();

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    window.clearTimeout(resizeTimer);
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onResize);
    removeEventListener('pointermove', onPointer);
    root.removeEventListener('click', onClick);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onLost);
    filmEvents.forEach(name => filmVideo?.removeEventListener(name, syncFilm));
    entries.forEach(e => {if (e.video) {e.video.pause(); e.video.removeAttribute('src'); e.video.load();}});
    filmVideo?.pause();
    if (header) header.dataset.over = '';
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
