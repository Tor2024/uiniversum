import { useLocale } from 'next-intl'
import Datenschutz from '@/components/legal/Datenschutz'

export default function DatenschutzPage() {
  const locale = useLocale()
  return <Datenschutz locale={locale} />
}