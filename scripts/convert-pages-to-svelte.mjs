/** Native Svelte page migration from the approved adapted HTML, not React JSX.
 * Run from the project root: node scripts/convert-pages-to-svelte.mjs
 * Reads existing typography artwork; never regenerates source content/assets.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const catalog = JSON.parse(await fs.readFile(path.join(root, 'src/data/type-art.json'), 'utf8'));
const imageDimensions = JSON.parse(await fs.readFile(path.join(root, 'src/data/image-dimensions.json'), 'utf8'));
const headingPattern = /<(h[123]|p)([^>]*class="[^"]*(?:c-heading|display-prose)[^"]*"[^>]*)>([\s\S]*?)<\/\1>/g;

function plain(value) {
  return value.replace(/<[^>]*>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, number) => String.fromCodePoint(parseInt(number, 16)))
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(+number))
    .replace(/&(amp|quot|apos|lt|gt|nbsp);/g, (_, name) => ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' }[name]))
    .replace(/\s+/g, ' ').trim();
}

function escapeText(value) {
  return value.replace(/[&<>"'{}]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '{': '&#123;', '}': '&#125;' }[character]));
}

function artwork(text, weight) {
  const hash = crypto.createHash('sha256').update(weight + '|' + text).digest('hex').slice(0, 20);
  const entry = catalog[hash];
  if (!entry) throw new Error(`Missing existing typography artwork (${weight}): ${text}`);
  const words = text.split(/\s+/);
  if (entry.words.length !== words.length) throw new Error(`Artwork word count differs for ${hash}`);
  return words.map((_, index) => {
    const width = entry.words[index].width;
    return `<svg class="type-word" aria-hidden="true" focusable="false" viewBox="0 0 ${width} ${entry.lineHeight}" style="width:${width / 40}em"><use href="{base}/typography/${entry.file}#word-${index}" width="100%" height="100%"></use></svg>`;
  }).join("{' '}");
}

function fontify(source) {
  return source.replace(headingPattern, (_, tag, attributes, contents) => {
    const text = plain(contents);
    const regular = artwork(text, 400);
    const visual = tag === 'h1'
      ? `{#if edition === 'blueprint'}${artwork(text, 700)}{:else}${regular}{/if}`
      : regular;
    const markup = `<span class="sr-only">${escapeText(text)}</span><span class="type-visual" aria-hidden="true">${visual}</span>`;
    const anchor = contents.match(/^\s*(<a\b[^>]*>)[\s\S]*<\/a>\s*$/);
    return `<${tag}${attributes}>${anchor ? anchor[1] + markup + '</a>' : markup}</${tag}>`;
  });
}

await fs.mkdir(path.join(root, 'src/lib/pages'), { recursive: true });
const results = [];
for (let index = 1; index <= 13; index += 1) {
  const input = await fs.readFile(path.join(root, `.build/p${index}-adapted.html`), 'utf8');
  const newsletterCount = (input.match(/<!--SITE_NEWSLETTER-->/g) || []).length;
  if (newsletterCount !== 1) throw new Error(`Page ${index}: expected one newsletter marker, got ${newsletterCount}`);
  if ((input.match(/<h1\b/g) || []).length !== 1) throw new Error(`Page ${index}: expected one source H1`);
  let markup = fontify(input)
    .replaceAll('<!--SITE_HEADER-->', '')
    .replaceAll('<!--SITE_FOOTER-->', '')
    .replaceAll('<!--SITE_NEWSLETTER-->', `<Newsletter pageIndex={${index}} />`)
    .replaceAll('__EDITION_ROOT__', '{base}/{edition}')
    .replaceAll('__BOOKING_URL__', 'https://reservations.orbebooking.com/Search/Init/PAS6c/en/')
    // The artwork URLs were emitted with {base}; only still-rooted sources
    // need prefixing here. Attributes remain native Svelte expressions.
    .replace(/\b(src|href)="\/(media|brand|typography)\//g, '$1="{base}/$2/');
  const script = `<script lang="ts">\n  import Newsletter from '#lib/components/Newsletter.svelte';\n\n  let { edition, base = '' }: { edition: 'blueprint' | 'figma'; base?: string } = $props();\n</script>\n`;
  markup = markup.replace(/(<section\b[^>]*data-role="gallery"[^>]*><figure\b[^>]*>)([\s\S]*?)(<\/figure>)(<button\b[^>]*data-gallery-open[\s\S]*?<\/button>)/g, '$1$2$4$3').replaceAll('href="https://reservations.orbebooking.com/Search/Init/PAS6c/en/"', 'href="https://reservations.orbebooking.com/Search/Init/PAS6c/en/" target="_blank" rel="noopener noreferrer"');
  markup = markup.replace(/<img\b[^>]*>/g, tag => {
    const name = tag.match(/\/media\/([^"/]+\.webp)/)?.[1];
    if (!name || /\bwidth=/.test(tag)) return tag;
    const [width, height] = imageDimensions[name];
    return tag.slice(0,-1) + ` width="${width}" height="${height}">`;
  });
  const output = script + '\n' + markup.trim() + '\n';
  if (output.includes('{@html') || output.includes('React') || output.includes('__EDITION_ROOT__') || output.includes('__BOOKING_URL__')) {
    throw new Error(`Page ${index}: forbidden migration residue`);
  }
  const filename = `P${String(index).padStart(2, '0')}.svelte`;
  await fs.writeFile(path.join(root, 'src/lib/pages', filename), output);
  results.push({ page: filename, bytes: Buffer.byteLength(output), headings: (input.match(/<h[123]\b/g) || []).length });
}
console.log(JSON.stringify({ converted: results.length, source: '.build/pN-adapted.html', pages: results }, null, 2));
