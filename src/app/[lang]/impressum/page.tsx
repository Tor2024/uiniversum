import { useLocale } from 'next-intl'
import Impressum from '@/components/legal/Impressum'

export default function ImpressumPage() {
  const locale = useLocale()
  return <Impressum locale={locale} />
}