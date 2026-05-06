export type Locale = 'de' | 'en' | 'ru';

export const defaultLocale: Locale = 'de';

export const locales: Locale[] = ['de', 'en', 'ru'];

export const hasLocale = (locale: string): locale is Locale => {
  return locales.includes(locale as Locale);
};