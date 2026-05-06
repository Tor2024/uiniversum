import homeData from '../../../data/pages/home.json';
import type { Locale } from '@/lib/i18n/utils';
import { BlockRenderer } from '@/components/blocks/renderer';
import styles from './page.module.css';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang as Locale;

  return (
    <main className="main-content">
      {/* Optional: Title can be rendered via a 'hero' block now */}
      {homeData.blocks.map((block: any) => (
        <BlockRenderer key={block.id} block={block} locale={typedLang} />
      ))}
    </main>
  );
}