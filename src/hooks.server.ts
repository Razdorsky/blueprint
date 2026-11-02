import type {Handle} from '@sveltejs/kit/hooks';
import {base} from '#lib/site.ts';
import * as figma from '#lib/site.ts';
import * as blueprint from '#lib/blueprint/site.ts';
// Each edition supplies its own page list and canvas colour.
export const handle:Handle=async({event,resolve})=>{const [edition='',...parts]=event.url.pathname.slice(base.length).split('/').filter(Boolean);const slug=parts.join('/');const chosen=edition==='blueprint'||edition==='figma'?edition:'';const page=(chosen==='blueprint'?blueprint.pages:figma.pages).find(p=>p.slug===slug);const color=chosen==='blueprint'?blueprint.canvas(page?.index||0):figma.canvas(chosen,page?.index||0);return resolve(event,{transformPageChunk:({html})=>html.replaceAll('__CANVAS__',color).replaceAll('__EDITION__',chosen).replaceAll('__PAGE__',page?.slug||'home').replaceAll('__HERO__',page?.photo?'photo':'paper')});};
