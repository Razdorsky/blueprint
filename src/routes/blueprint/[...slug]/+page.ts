import {error} from '@sveltejs/kit';
import {pages, resolve} from '#lib/blueprint/site.ts';
export const entries = () => pages.map(page => ({slug: page.path}));
export function load({params}: {params: {slug?: string}}) {
  const found = resolve(params.slug || '');
  if (!found) error(404, 'Page not found');
  return found;
}
