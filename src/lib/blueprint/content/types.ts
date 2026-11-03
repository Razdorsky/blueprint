// The Blueprint pages are data. Every page is a list of blocks from one small vocabulary,
// so the eighteen pages share one design system. Text is written in English; Spanish comes
// from content/es.json. Inline marks: *italic*, and a line break as "\n".
import type {Tone} from '../site.ts';
import type {FilmName, LoopName} from '../media.ts';

export type Media =
  | {photo: string; alt: string; focus?: string}
  | {loop: LoopName; alt: string; focus?: string};

/** to: a page slug ("" is home), "booking", or "pending:<what>" for a destination not supplied yet. */
export type Action = {label: string; to: string; primary?: boolean};
export type Door = {to: string; media: Media; title: string; text: string; meta?: string; action?: string};
/** A picture of the land with a few words under it; `to` opens the page it belongs to. */
export type Glimpse = {media: Media; caption: string; to?: string};

type Base = {tone?: Tone; id?: string};
export type Block = Base & (
  | {type: 'hero'; media: Media; title: string; lede?: string; actions?: Action[]}
  | {type: 'split'; media: Media; title?: string; body: string[]; actions?: Action[]; flip?: boolean; aside?: Media}
  | {type: 'doors'; title?: string; body?: string[]; items: Door[]; actions?: Action[]; rail?: boolean; wide?: boolean}
  | {type: 'facts'; title: string; body?: string[]; actions?: Action[]; items: [string, string][]; media?: Media}
  | {type: 'steps'; title: string; body?: string[]; items: {title: string; text: string; media?: Media}[]; actions?: Action[]; numbered?: boolean}
  | {type: 'gallery'; title?: string; items: Media[]}
  | {type: 'film'; film: FilmName; title: string; body?: string; grow?: boolean}
  | {type: 'land'; title: string; body?: string; items: Glimpse[]}
  | {type: 'stay'; title: string; body: string[]; items: Door[]; actions?: Action[]}
  | {type: 'nightfall'; media: Media; title: string; body: string[]; aside: Media; actions?: Action[]}
  | {type: 'projection'; title: string; states: {media: Media; text: string}[]; actions?: Action[]}
  | {type: 'voices'; media: Media; founder: string; quote: string[]; by: string; role?: string; press: string; actions?: Action[]}
  | {type: 'table'; title: string; body?: string[]; head: string[]; rows: string[][]; media?: Media}
  | {type: 'events'; title: string; body?: string[]; items: {date: string; name: string; line: string; price: string}[]; action: Action; media?: Media}
  | {type: 'map'; media: Media; title: string; body?: string[]; items: string[]}
  | {type: 'notes'; title: string; items: {title?: string; text: string}[]; actions?: Action[]; media?: Media}
  | {type: 'newsletter'; variant?: 'events'}
);

export type PageContent = {title: string; description: string; blocks: Block[]};
