import fs from 'node:fs/promises';
const sources={blueprint:'src/lib/blueprint/site-data.json',figma:'src/lib/site-data.json'};
const pagesFor={};for(const [edition,file] of Object.entries(sources))pagesFor[edition]=JSON.parse(await fs.readFile(file,'utf8'));
const base=(process.env.SITE_BASE_PATH||'').replace(/\/$/,'');
const routes=['blueprint','figma'].flatMap(edition=>pagesFor[edition].map(p=>({edition,index:p.index,slug:p.slug,path:`${base}/${edition}/${p.slug?p.slug+'/':''}`})));
await fs.writeFile('dist/routes.json',JSON.stringify(routes,null,2)+'\n');
console.log(`SvelteKit prerendered ${routes.length} edition pages`);
