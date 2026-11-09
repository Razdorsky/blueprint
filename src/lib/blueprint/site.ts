// Blueprint edition data. Independent of the frozen Figma edition (src/lib/site.ts).
// Eighteen pages, read in order as one story; every page exists in English and Spanish.
import sourcePages from './site-data.json';

export type Locale = 'en' | 'es';
export type Tone = 'paper' | 'clay' | 'forest' | 'petrol' | 'night';
export type Group = 'home' | 'stay' | 'experiences' | 'property';
export type SitePage = {index:number;id:string;name:string;slug:string;group:Group;tone:Tone;photo:boolean};
export type RoutePage = SitePage & {path:string;locale:Locale};

export const edition = 'blueprint';
export const locales: Locale[] = ['en', 'es'];
export const sitePages = sourcePages as SitePage[];
// Booking opens in the page's language (owner, 2026-11-09).
export const booking = (locale: Locale = 'en') => `https://reservations.orbebooking.com/Search/Init/PAS6c/${locale === 'es' ? 'es' : 'en'}/`;
export const base: string = __SITE_BASE__;

const prefix = (locale: Locale) => (locale === 'es' ? 'es/' : '');
export const pathOf = (slug: string, locale: Locale) => `${prefix(locale)}${slug}`.replace(/\/$/, '');
export const route = (slug = '', locale: Locale = 'en', root = base) =>
  `${root.replace(/\/$/, '')}/blueprint/${pathOf(slug, locale) ? pathOf(slug, locale) + '/' : ''}`;

/** Every prerendered route. The shared server hook looks pages up by this list. */
export const pages: RoutePage[] = locales.flatMap(locale =>
  sitePages.map(page => ({...page, locale, path: pathOf(page.slug, locale), slug: pathOf(page.slug, locale)}))
);

export function resolve(path: string) {
  const clean = path.replace(/^\/|\/$/g, '');
  const locale: Locale = clean === 'es' || clean.startsWith('es/') ? 'es' : 'en';
  const slug = locale === 'es' ? clean.replace(/^es\/?/, '') : clean;
  const page = sitePages.find(item => item.slug === slug);
  return page ? {page, locale} : undefined;
}

export const pageBySlug = (slug: string) => sitePages.find(item => item.slug === slug);
export const next = (page: SitePage) => sitePages[page.index % sitePages.length];
export const groupPages = (group: Group) => sitePages.filter(item => item.group === group);

const grounds: Record<Tone, string> = {paper: '#f5ebe7', clay: '#e7d8d3', forest: '#1a3013', petrol: '#062a33', night: '#111111'};
export const ground = (tone: Tone) => grounds[tone];
export const dark = (tone: Tone) => tone === 'forest' || tone === 'petrol' || tone === 'night';
/** Used by the shared server hook for the first paint colour of each route. */
export const canvas = (index: number) => ground(sitePages.find(item => item.index === index)?.tone || 'paper');
