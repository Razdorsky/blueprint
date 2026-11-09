// Figma Enhanced edition: its own page list and media aliases, copied from the frozen Figma edition.
import sourcePages from './site-data.json';
import media from './media.json';
export type Edition = 'figma-enhanced';
export type PageMeta = {index:number;id:string;name:string;slug:string;photo:boolean};
export const pages:PageMeta[]=sourcePages;
export const booking='https://reservations.orbebooking.com/Search/Init/PAS6c/en/'; // the edition is in English; the Spanish booking page is /es/ (owner, 2026-11-09)
export const route=(edition:Edition,slug='',base='')=>`${base.replace(/\/$/,'')}/${edition}/${slug?slug+'/':''}`;
export function photo(index:number){const aliases=(media.find(p=>p.index===index)?.aliases||{}) as Record<string,string>;return Object.entries(aliases).find(([key,url])=>!/Logo|Wordmark|Symbol|Pattern|Color|Group|Vector/i.test(key)&&!url.endsWith('.svg'))?.[1]||Object.values(aliases).find(u=>!u.endsWith('.svg'))||'';}
export const canvas=(_edition:string,_index:number)=>'#ffffff';

export const base=__SITE_BASE__;
