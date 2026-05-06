import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/i18n/utils';
import { generateCssVariables, DesignTokens } from '@/lib/design-tokens';
import { PresetRenderer } from '@/components/presets/PresetRenderer';

interface Props {
  params: Promise<{ lang: string; presetId: string }>;
}

function loadPreset(presetId: string) {
  const filePath = path.join(process.cwd(), 'data', 'presets', `${presetId}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export default async function PreviewPage({ params }: Props) {
  const { lang, presetId } = await params;
  const locale = lang as Locale;

  const preset = loadPreset(presetId);
  if (!preset) notFound();

  const tokens = preset.design?.tokens as DesignTokens;
  const cssVars = generateCssVariables(tokens);

  // Загружаем Google Fonts для этого пресета
  const fontDisplay = tokens?.fontDisplay?.replace(/ /g, '+') || 'Playfair+Display';
  const fontBody = tokens?.fontBody?.replace(/ /g, '+') || 'Inter';
  const fontsUrl = `https://fonts.googleapis.com/css2?family=${fontDisplay}:ital,wght@0,400;0,600;0,700;1,400&family=${fontBody}:wght@300;400;500;600&display=swap`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href={fontsUrl} rel="stylesheet" />

      {/* Preview banner */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>
            👁 Vorschau: {preset.meta?.title}
          </span>
          <span style={{
            fontSize: '11px',
            background: '#6366f1',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '4px',
          }}>
            {presetId}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a
            href="/admin/presets"
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              textDecoration: 'none',
              padding: '5px 12px',
              border: '1px solid #374151',
              borderRadius: '6px',
            }}
          >
            ← Zurück
          </a>
          <form action="/api/clone-preset" method="POST" style={{ display: 'inline' }}>
            <input type="hidden" name="presetId" value={presetId} />
            <button
              type="submit"
              style={{
                fontSize: '12px',
                color: '#fff',
                background: '#22c55e',
                border: 'none',
                padding: '5px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ✓ Dieses Template verwenden
            </button>
          </form>
        </div>
      </div>

      {/* Actual site preview */}
      <div style={{ paddingTop: '44px' }}>
        <PresetRenderer preset={preset} locale={locale} />
      </div>
    </>
  );
}
