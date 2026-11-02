import fs from 'node:fs/promises';
const pages=JSON.parse(await fs.readFile('src/lib/site-data.json','utf8'));
const base=(process.env.SITE_BASE_PATH||'').replace(/\/$/,'');
const routes=['blueprint','figma'].flatMap(edition=>pages.map(p=>({edition,index:p.index,slug:p.slug,path:`${base}/${edition}/${p.slug?p.slug+'/':''}`})));
await fs.writeFile('dist/routes.json',JSON.stringify(routes,null,2)+'\n');
console.log(`SvelteKit prerendered ${routes.length} edition pages`);
