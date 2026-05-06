import Link from 'next/link'
import siteData from '../../../../data/site.json'
import { DesignTokens } from '@/lib/design-tokens'

const colorKeys: { name: string; desc: string; key: keyof DesignTokens }[] = [
  { name: 'Фон страницы',      desc: 'Основной цвет фона всего сайта',           key: 'colorBackground' },
  { name: 'Поверхность',       desc: 'Цвет карточек, панелей, модальных окон',   key: 'colorSurface' },
  { name: 'Основной текст',    desc: 'Заголовки и основной текст',               key: 'colorPrimary' },
  { name: 'Второстепенный',    desc: 'Подписи, описания, метаданные',            key: 'colorSecondary' },
  { name: 'Граница',           desc: 'Разделители и рамки элементов',            key: 'colorBorder' },
  { name: 'Акцент (CTA)',      desc: 'Кнопки, ссылки, выделения',               key: 'colorAccent' },
]

const fontKeys: { name: string; desc: string; key: keyof DesignTokens }[] = [
  { name: 'Display шрифт',  desc: 'Крупные заголовки Hero-секции',    key: 'fontDisplay' },
  { name: 'Heading шрифт',  desc: 'Заголовки разделов',               key: 'fontHeading' },
  { name: 'Body шрифт',     desc: 'Основной текст страницы',          key: 'fontBody' },
]

export default async function DesignPage() {
  const tokens = siteData.design.tokens as DesignTokens

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>
          🎨 Дизайн сайта
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Текущие настройки дизайна вашего сайта. Для смены стиля выберите новый шаблон.
        </p>
      </div>

      {/* Info banner */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '10px',
        padding: '14px 16px',
        marginBottom: '24px',
        display: 'flex',
        gap: '10px',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af', margin: '0 0 2px' }}>
            Как изменить дизайн?
          </p>
          <p style={{ fontSize: '13px', color: '#3b82f6', margin: 0 }}>
            Выберите один из 30 готовых шаблонов в разделе{' '}
            <Link href="/admin/presets" style={{ color: '#2563eb', fontWeight: 600 }}>
              Шаблоны →
            </Link>{' '}
            — цвета, шрифты и стиль применятся автоматически.
            Тонкая настройка цветов будет доступна в следующей версии.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>

        {/* Current preset */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 16px' }}>
            Активный шаблон
          </h2>
          <div style={{
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '10px',
            border: '2px solid #6366f1',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '32px' }}>✨</span>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: '0 0 2px' }}>
                {siteData.design.preset.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                Текущий активный стиль сайта
              </p>
            </div>
          </div>
          <Link
            href="/admin/presets"
            style={{
              display: 'block',
              marginTop: '12px',
              padding: '10px',
              background: '#6366f1',
              color: '#fff',
              borderRadius: '8px',
              textAlign: 'center',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Сменить шаблон →
          </Link>
        </div>

        {/* Colors */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 16px' }}>
            Цветовая палитра
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {colorKeys.map((c) => {
              const value = tokens[c.key] as string
              return (
                <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: value,
                    border: '1px solid rgba(0,0,0,0.1)',
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111', margin: '0 0 1px' }}>
                      {c.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
                      {c.desc}
                    </p>
                  </div>
                  <code style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    background: '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    flexShrink: 0,
                  }}>
                    {value}
                  </code>
                </div>
              )
            })}
          </div>
        </div>

        {/* Fonts */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 16px' }}>
            Шрифты
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {fontKeys.map((f) => {
              const value = tokens[f.key] as string
              return (
                <div key={f.key} style={{
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #f3f4f6',
                }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {f.name}
                  </p>
                  <p style={{
                    fontSize: '18px',
                    fontFamily: `'${value}', serif`,
                    color: '#111',
                    margin: '0 0 2px',
                    fontWeight: 600,
                  }}>
                    {value}
                  </p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Spacing & Radius */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 16px' }}>
            Параметры стиля
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Скругление углов', value: tokens.borderRadius + 'px', desc: 'Радиус кнопок и карточек' },
              { label: 'Тень', value: tokens.shadowStyle, desc: 'Стиль теней элементов' },
              { label: 'Анимация', value: tokens.transitionDuration, desc: 'Скорость переходов' },
              { label: 'Макс. ширина', value: tokens.maxWidthContent, desc: 'Ширина контентной зоны' },
              { label: 'Отступ секции', value: tokens.spacingSection, desc: 'Расстояние между блоками' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#374151', margin: '0 0 1px' }}>{item.label}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>{item.desc}</p>
                </div>
                <code style={{ fontSize: '12px', color: '#6366f1', background: '#eef2ff', padding: '3px 8px', borderRadius: '6px' }}>
                  {item.value}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
