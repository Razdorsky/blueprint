// Per-page context: the locale, the translator and link resolution for blocks and chrome.
import {getContext, setContext} from 'svelte';
import {translate} from './i18n.ts';
import {booking, route, type Locale, type SitePage} from './site.ts';

export type Bp = {
  locale: Locale;
  page: SitePage;
  t: (text: string) => string;
  /** A page slug, "booking", or "pending:<what>" (returns null: not connected yet). */
  href: (to: string) => string | null;
};

const key = Symbol('blueprint');

export function provide(locale: Locale, page: SitePage) {
  const value: Bp = {
    locale,
    page,
    t: text => translate(locale, text),
    href: to => (to === 'booking' ? booking(locale) : to.startsWith('pending:') ? null : route(to, locale))
  };
  setContext(key, value);
  return value;
}

export const bp = () => getContext<Bp>(key);

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Inline marks: *italic*, line breaks, and [bracketed] facts still to be supplied. */
export function rich(text: string) {
  return escape(text)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]/g, '<span class="tbd" title="To be supplied">[$1]</span>')
    .replace(/\n/g, '<br>');
}
