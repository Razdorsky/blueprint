// GitHub Pages artifact for one edition, published like the legacy Blueprint:
// a project site whose URL prefix is the repository name.
//
//   node scripts/build-pages.mjs figma      -> outputs/github-pages (served at /figma/)
//   node scripts/build-pages.mjs blueprint  -> outputs/github-pages (served at /blueprint/)
//
// Run after `npm run build`. The normal build keeps every route under /figma/ or
// /blueprint/, which is exactly the project-site prefix, so page links stay as they
// are. Only references that point at the site root (/_app, /media, /typography,
// /brand) are moved under the prefix. Source files of either edition are untouched.
import fs from 'node:fs/promises';
import path from 'node:path';

const edition = process.argv[2];
if (edition !== 'figma' && edition !== 'blueprint') {
  console.error('Usage: node scripts/build-pages.mjs figma|blueprint');
  process.exit(1);
}

const dist = path.resolve('dist');
const out = path.resolve('outputs/github-pages');
const roots = ['_app', 'media', 'typography', 'brand'];

await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
await fs.cp(path.join(dist, edition), out, { recursive: true });
for (const root of roots) await fs.cp(path.join(dist, root), path.join(out, root), { recursive: true });

async function* files(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(full);
    else yield full;
  }
}

const prefix = `/${edition}`;
let html = 0;
let js = 0;
for await (const file of files(out)) {
  if (file.endsWith('.html')) {
    const source = await fs.readFile(file, 'utf8');
    const result = source
      // SvelteKit's relative asset paths (../../_app/...) assume the site root.
      .replace(/(["'(])(?:\.\.\/)+(_app|brand|media|typography)\//g, `$1${prefix}/$2/`)
      // Static media and typography written as root paths by the page components.
      .replace(/(["'(])\/(media|typography|brand)\//g, `$1${prefix}/$2/`);
    if (result !== source) {
      await fs.writeFile(file, result);
      html += 1;
    }
  } else if (file.endsWith('.js') && file.includes(`${path.sep}_app${path.sep}`)) {
    const source = await fs.readFile(file, 'utf8');
    // Client-rendered pages build the same root paths at runtime (`${base}/media/...`).
    const result = source.replace(/(["'`}])\/(media|typography|brand)\//g, `$1${prefix}/$2/`);
    if (result !== source) {
      await fs.writeFile(file, result);
      js += 1;
    }
  }
}

// Every reference must now resolve inside the artifact.
const problems = [];
for await (const file of files(out)) {
  if (!file.endsWith('.html')) continue;
  const text = await fs.readFile(file, 'utf8');
  for (const [, ref] of text.matchAll(/(?:src|href)="([^"#?]+)/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    const absolute = ref.startsWith('/') ? ref : path.posix.join(path.posix.dirname('/' + path.relative(out, file).split(path.sep).join('/')), ref);
    const normalized = ref.startsWith('/') ? absolute : prefix + absolute;
    if (!normalized.startsWith(prefix + '/')) {
      problems.push(`${path.relative(out, file)}: ${ref} leaves ${prefix}/`);
      continue;
    }
    let target = path.join(out, normalized.slice(prefix.length));
    if (normalized.endsWith('/')) target = path.join(target, 'index.html');
    try { await fs.access(target); } catch { problems.push(`${path.relative(out, file)}: missing ${ref}`); }
  }
}
if (problems.length) {
  console.error(problems.slice(0, 40).join('\n'));
  process.exit(1);
}

await fs.writeFile(path.join(out, '.nojekyll'), '');
console.log(`GitHub Pages artifact for /${edition}/: outputs/github-pages (${html} pages and ${js} scripts re-rooted, all references resolve)`);
