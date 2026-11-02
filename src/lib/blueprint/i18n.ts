// English is the source. Spanish (es-LA) is a dictionary keyed by the English text,
// so a changed English string is reported as untranslated rather than silently stale.
import es from './content/es.json';
import type {Locale} from './site.ts';

const dictionaries: Record<Locale, Record<string, string>> = {en: {}, es: es as Record<string, string>};

export function translate(locale: Locale, text: string) {
  if (locale === 'en' || !text) return text;
  return dictionaries[locale][text] ?? text;
}

export const missing = (locale: Locale, texts: string[]) =>
  locale === 'en' ? [] : texts.filter(text => text && !(text in dictionaries[locale]));
