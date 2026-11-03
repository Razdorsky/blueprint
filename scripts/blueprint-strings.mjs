// Every English string the Blueprint edition shows, for translation and for the coverage check.
//   node scripts/blueprint-strings.mjs            -> fails if es.json misses or keeps stale strings
//   node scripts/blueprint-strings.mjs --list     -> prints the strings as JSON
import fs from 'node:fs/promises';
import path from 'node:path';
import {content} from '../src/lib/blueprint/content/pages.ts';

const skip = new Set(['photo', 'loop', 'to', 'focus', 'type', 'tone', 'film', 'id', 'by', 'variant', 'rail', 'flip', 'primary', 'place']);
const strings = new Set();
const walk = (value, key = '') => {
  if (typeof value === 'string') { if (!skip.has(key) && value.trim()) strings.add(value); return; }
  if (Array.isArray(value)) return value.forEach(item => walk(item, key));
  if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walk(v, k);
};
walk(content);

for (const page of JSON.parse(await fs.readFile('src/lib/blueprint/site-data.json', 'utf8'))) strings.add(page.name);

// Interface text: literal arguments of t('…') in the edition's components and scripts.
async function* files(dir) {
  for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(full);
    else if (/\.(svelte|ts)$/.test(entry.name)) yield full;
  }
}
for await (const file of files('src/lib/blueprint')) {
  const source = await fs.readFile(file, 'utf8');
  // Literals are read as written, so turn their escaped line breaks into real ones.
  for (const match of source.matchAll(/\bt\((['"])((?:(?!\1).)+)\1\)/g)) strings.add(match[2].replace(/\\n/g, '\n'));
  for (const match of source.matchAll(/\bt\(variant === 'events'\s*\?\s*'([^']+)'\s*:\s*'([^']+)'\)/g)) { strings.add(match[1]); strings.add(match[2]); }
  // Labels kept in arrays and maps inside components (groups, footer links, newsletter copy).
  for (const match of source.matchAll(/\/\/ i18n: (.+)$/gm)) for (const item of JSON.parse(match[1])) strings.add(item);
}

const list = [...strings].sort((a, b) => a.localeCompare(b));
if (process.argv.includes('--list')) {
  console.log(JSON.stringify(list, null, 1));
} else {
  const es = JSON.parse(await fs.readFile('src/lib/blueprint/content/es.json', 'utf8'));
  const missing = list.filter(text => !(text in es));
  const stale = Object.keys(es).filter(text => !strings.has(text));
  if (missing.length || stale.length) {
    if (missing.length) console.error(`Spanish is missing ${missing.length} strings, e.g.:\n  ${missing.slice(0, 12).join('\n  ')}`);
    if (stale.length) console.error(`Spanish keeps ${stale.length} strings the site no longer shows, e.g.:\n  ${stale.slice(0, 12).join('\n  ')}`);
    process.exitCode = 1;
  } else console.log(`Blueprint Spanish covers all ${list.length} strings`);
}
