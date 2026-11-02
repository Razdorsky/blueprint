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

type Base = {tone?: Tone; id?: string};
export type Block = Base & (
  | {type: 'hero'; media: Media; title: string; lede?: string; actions?: Action[]}
  | {type: 'statement'; text: string; body?: string[]; actions?: Action[]}
  | {type: 'split'; media: Media; title?: string; body: string[]; actions?: Action[]; flip?: boolean; aside?: Media}
  | {type: 'chapter'; media: Media; title: string; body?: string[]; actions?: Action[]}
  | {type: 'doors'; title?: string; body?: string[]; items: Door[]; actions?: Action[]; rail?: boolean}
  | {type: 'facts'; title: string; body?: string[]; actions?: Action[]; items: [string, string][]}
  | {type: 'steps'; title: string; body?: string[]; items: {title: string; text: string; media?: Media}[]; actions?: Action[]}
  | {type: 'gallery'; title?: string; items: Media[]}
  | {type: 'film'; film: FilmName; title: string; body?: string}
  | {type: 'quote'; text: string[]; by: string; role?: string}
  | {type: 'founder'; media: Media; title: string; actions?: Action[]}
  | {type: 'press'; title: string}
  | {type: 'table'; title: string; body?: string[]; head: string[]; rows: string[][]}
  | {type: 'events'; title: string; body?: string[]; items: {date: string; name: string; line: string; price: string}[]; action: Action}
  | {type: 'map'; media: Media; title: string; body?: string[]; items: string[]}
  | {type: 'notes'; title: string; items: {title?: string; text: string}[]; actions?: Action[]}
  | {type: 'newsletter'; variant?: 'events'}
);

export type PageContent = {title: string; description: string; blocks: Block[]};
