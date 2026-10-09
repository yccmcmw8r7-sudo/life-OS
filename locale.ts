import type {LanguageCode} from './messages';

/** BCP-47 locale tags used for dates, numbers and percentages. */
export const LOCALE_TAGS: Record<LanguageCode, string> = {
  pt: 'pt-PT', en: 'en-GB', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT',
  nl: 'nl-NL', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR', ar: 'ar', hi: 'hi-IN',
  ru: 'ru-RU', tr: 'tr-TR', id: 'id-ID', sw: 'sw-KE', bn: 'bn-BD', ur: 'ur-PK',
  uk: 'uk-UA', pl: 'pl-PL',
};

const RTL_LANGUAGES = new Set<LanguageCode>(['ar', 'ur']);
export function isRTL(language: LanguageCode): boolean { return RTL_LANGUAGES.has(language); }
export function localeTag(language: LanguageCode): string { return LOCALE_TAGS[language] ?? 'en-GB'; }

export function formatLocalizedDate(value: string | number | Date, language: LanguageCode,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  try { return new Intl.DateTimeFormat(localeTag(language), options).format(date); }
  catch { return new Intl.DateTimeFormat('en-GB', options).format(date); }
}

export function formatLocalizedNumber(value: number, language: LanguageCode, maximumFractionDigits = 1): string {
  try { return new Intl.NumberFormat(localeTag(language), { maximumFractionDigits }).format(value); }
  catch { return new Intl.NumberFormat('en-GB', { maximumFractionDigits }).format(value); }
}

export function formatLocalizedPercent(value: number, language: LanguageCode, maximumFractionDigits = 0): string {
  try { return new Intl.NumberFormat(localeTag(language), { style: 'percent', maximumFractionDigits }).format(value); }
  catch { return new Intl.NumberFormat('en-GB', { style: 'percent', maximumFractionDigits }).format(value); }
}
