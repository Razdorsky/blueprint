import type {Handle} from '@sveltejs/kit/hooks';
import {base} from '#lib/site.ts';
import {pages,canvas} from '#lib/site.ts';
export const handle:Handle=async({event,resolve})=>{const [edition='',...parts]=event.url.pathname.slice(base.length).split('/').filter(Boolean);const slug=parts.join('/');const page=pages.find(p=>p.slug===slug);const chosen=edition==='blueprint'||edition==='figma'?edition:'';return resolve(event,{transformPageChunk:({html})=>html.replaceAll('__CANVAS__',canvas(chosen,page?.index||0)).replaceAll('__EDITION__',chosen).replaceAll('__PAGE__',page?.slug||'home').replaceAll('__HERO__',page?.photo?'photo':'paper')});};
