import {error} from '@sveltejs/kit';
import {pages,type Edition} from '#lib/site.ts';
export const entries=()=>['blueprint','figma'].flatMap(edition=>pages.map(page=>({edition,slug:page.slug})));
export function load({params}:{params:{edition:string;slug?:string}}){if(params.edition!=='blueprint'&&params.edition!=='figma')error(404,'Page not found');const page=pages.find(p=>p.slug===(params.slug||'').replace(/^\/|\/$/g,''));if(!page)error(404,'Page not found');return {edition:params.edition as Edition,page};}
