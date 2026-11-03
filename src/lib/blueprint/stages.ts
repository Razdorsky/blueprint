// The places of the stage. A page that tells its story in places opens each chapter on a full-screen
// stage: a photograph or a film of the place, with the place's word standing between the subject and
// what is behind it (the subject's matte comes from scripts/blueprint-media/stage-media.sh).
// Compositions are written in the picture's own coordinates (0–1), so the word keeps its place on the
// picture at any screen size: focus is the point the crop keeps in view; word is its centre and the
// height of its capitals as a share of the picture's height. One height for every place, so the words
// read as one set of inscriptions in any language; the width follows the word. Phones have their own
// upright crop.
import {asset} from './media.ts';

export type Variant = {
  src: string; w: number; h: number;
  /** The same crop at a higher resolution, for screens that would enlarge src by more than a fifth
   *  (large phones and tablets held upright). */
  large?: string;
  /** How the subject's matte travels with the picture: side by side (picture left, matte right) or
   *  one above the other (picture on top, matte below). Films are side by side; stills go along
   *  their short side, to stay within a 4096-pixel texture. w and h are the picture's. */
  pack: 'side' | 'stack';
  flat: string; cut: string;
  focus: [number, number];
  word: [number, number, number];
  /** The word is composed beside its subject: on a narrower screen it keeps its near edge and
   *  narrows rather than moving over the subject. */
  hold?: boolean;
  /** Everything behind the subject is brought down to this share of its light, so the word stands at
   *  least 3:1 against what is right around it (measured on the drawn place); the subject keeps its
   *  own light. 1 or none: as photographed. */
  dim?: number;
};
/** shade: how much the place darkens just behind its word. sky: a polariser on everything behind the
 *  subject, deepening a bright sky so the word reads; the subject itself is untouched. */
export type Place = {word: string; desktop: Variant; phone: Variant; shade: number; sky: number} | {film: 'vessyl'};
const v = (name: string) => asset(`/bp/stage/${name}`);

// i18n: ["Arenal", "Sound", "Table"]
export const places: Record<'arrival' | 'film' | 'sound' | 'table', Place> = {
  arrival: {
    word: 'Arenal', shade: 0.16, sky: 0.15,
    desktop: {src: v('stage-arrival.mp4'), w: 1920, h: 1080, pack: 'side', flat: v('stage-arrival.webp'), cut: v('stage-arrival-cut.webp'), focus: [0.5, 0.5], word: [0.645, 0.43, 0.135], hold: true},
    phone: {src: v('stage-arrival-m.mp4'), large: v('stage-arrival-l.mp4'), w: 720, h: 1280, pack: 'side', flat: v('stage-arrival-m.webp'), cut: v('stage-arrival-m-cut.webp'), focus: [0.38, 0], word: [0.47, 0.155, 0.066], dim: 0.82}
  },
  film: {film: 'vessyl'},
  sound: {
    word: 'Sound', shade: 0.42, sky: 0.9,
    desktop: {src: v('stage-sound-pack.webp'), w: 2560, h: 1440, pack: 'stack', flat: v('stage-sound.webp'), cut: v('stage-sound-cut.webp'), focus: [0.5, 0.6], word: [0.5, 0.585, 0.135], dim: 0.64},
    phone: {src: v('stage-sound-m-pack.webp'), large: v('stage-sound-l-pack.webp'), w: 1080, h: 1920, pack: 'side', flat: v('stage-sound-m.webp'), cut: v('stage-sound-m-cut.webp'), focus: [0.5, 0.5], word: [0.5, 0.36, 0.066], dim: 0.64}
  },
  table: {
    word: 'Table', shade: 0.16, sky: 0.3,
    desktop: {src: v('stage-table-pack.webp'), w: 2560, h: 1440, pack: 'stack', flat: v('stage-table.webp'), cut: v('stage-table-cut.webp'), focus: [0.5, 0.4], word: [0.42, 0.355, 0.135], dim: 0.78},
    phone: {src: v('stage-table-m-pack.webp'), large: v('stage-table-l-pack.webp'), w: 1080, h: 1920, pack: 'side', flat: v('stage-table-m.webp'), cut: v('stage-table-m-cut.webp'), focus: [0.5, 0.4], word: [0.5, 0.27, 0.066], dim: 0.78}
  }
};

export type PlaceName = keyof typeof places;
export const isFilm = (place: Place): place is {film: 'vessyl'} => 'film' in place;
