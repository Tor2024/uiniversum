import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { hasLocale, locales } from '@/lib/i18n/utils'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  const locale = await requestLocale

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !hasLocale(locale)) notFound()

  return {
    locale,
    messages: (await import(`@/lib/i18n/${locale}.json`)).default,
    timeZone: 'Europe/Berlin'
  }
})