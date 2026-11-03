// Photographs and films for the Blueprint edition.
// Brand photos live in public/bp/img as <name>-<width>.webp; images the Figma edition
// already published are reused read-only from public/media by their hash ("site:<hash>").
import photos from './data/photos.json';
import siteMedia from './data/site-media.json';
import {base} from './site.ts';

type PhotoMeta = {w:number;h:number;widths:number[];color:string};
export type Photo = {src:string;srcset:string;w:number;h:number;color:string};

const root = () => base.replace(/\/$/, '');
export const asset = (path: string) => `${root()}${path}`;

export function photo(name: string): Photo {
  if (name.startsWith('site:')) {
    const hash = name.slice(5);
    const meta = (siteMedia as Record<string, {w:number;h:number;color:string}>)[hash];
    if (!meta) throw new Error(`Unknown site image ${hash}`);
    const src = asset(`/media/${hash}.webp`);
    return {src, srcset: `${src} ${meta.w}w`, w: meta.w, h: meta.h, color: meta.color};
  }
  const meta = (photos as Record<string, PhotoMeta>)[name];
  if (!meta) throw new Error(`Unknown photo ${name}`);
  const url = (w: number) => asset(`/bp/img/${name}-${w}.webp`);
  const largest = meta.widths[meta.widths.length - 1];
  return {src: url(meta.widths.includes(1600) ? 1600 : largest), srcset: meta.widths.map(w => `${url(w)} ${w}w`).join(', '), w: meta.w, h: meta.h, color: meta.color};
}

export const loops = ['pool', 'night', 'dome', 'hearth', 'river', 'stars', 'violin', 'studio', 'treehouse', 'house',
  'villas', 'rates', 'sessions', 'day', 'evening', 'listening', 'pasture', 'tents', 'inside'] as const;
export const films = ['vessyl', 'events'] as const;
export type LoopName = (typeof loops)[number];
export type FilmName = (typeof films)[number];
/** Loops cut for full-screen openings also have a 1280 px copy for phones. */
const phoneCut: LoopName[] = ['pool', 'treehouse', 'house', 'villas', 'rates', 'sessions', 'day', 'evening', 'listening', 'pasture', 'tents', 'inside'];
export const loop = (name: LoopName) => ({
  src: asset(`/bp/video/loop-${name}.mp4`),
  phone: phoneCut.includes(name) ? asset(`/bp/video/loop-${name}-m.mp4`) : undefined,
  poster: asset(`/bp/video/loop-${name}.webp`)
});
/** A film with sound, and the silent 12-second preview that plays until someone opens it. */
export const film = (name: FilmName) => ({
  src: asset(`/bp/video/film-${name}.mp4`),
  preview: asset(`/bp/video/film-${name}-preview.mp4`),
  previewPhone: asset(`/bp/video/film-${name}-preview-m.mp4`),
  poster: asset(`/bp/video/film-${name}.webp`)
});
