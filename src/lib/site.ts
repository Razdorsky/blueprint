import sourcePages from './site-data.json';
import media from '../data/media.json';
export type Edition = 'blueprint' | 'figma';
export type PageMeta = {index:number;id:string;name:string;slug:string;photo:boolean};
export const pages:PageMeta[]=sourcePages;
export const booking='https://akenhotels.com/en/vessyl-home/';
export const route=(edition:Edition,slug='',base='')=>`${base.replace(/\/$/,'')}/${edition}/${slug?slug+'/':''}`;
export function photo(index:number){const aliases=(media.find(p=>p.index===index)?.aliases||{}) as Record<string,string>;return Object.entries(aliases).find(([key,url])=>!/Logo|Wordmark|Symbol|Pattern|Color|Group|Vector/i.test(key)&&!url.endsWith('.svg'))?.[1]||Object.values(aliases).find(u=>!u.endsWith('.svg'))||'';}
export const canvas=(edition:string,index:number)=>edition==='blueprint'?(index===1?'#311500':'#141913'):'#ffffff';

export const base=__SITE_BASE__;
