// Blueprint edition data. Independent of the frozen Figma edition (src/lib/site.ts).
import sourcePages from './site-data.json';
import media from './data/media.json';
export type PageMeta = {index:number;id:string;name:string;slug:string;photo:boolean};
export const edition = 'blueprint';
export const pages:PageMeta[]=sourcePages;
export const booking='https://akenhotels.com/en/vessyl-home/';
export const route=(slug='',base='')=>`${base.replace(/\/$/,'')}/blueprint/${slug?slug+'/':''}`;
export function photo(index:number){const aliases=(media.find(p=>p.index===index)?.aliases||{}) as Record<string,string>;return Object.entries(aliases).find(([key,url])=>!/Logo|Wordmark|Symbol|Pattern|Color|Group|Vector/i.test(key)&&!url.endsWith('.svg'))?.[1]||Object.values(aliases).find(u=>!u.endsWith('.svg'))||'';}
export const canvas=(index:number)=>index===1?'#311500':'#141913';

export const base=__SITE_BASE__;
