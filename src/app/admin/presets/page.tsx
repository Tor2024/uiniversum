import fs from 'fs';
import path from 'path';

interface PresetData {
  id: string;
  title: string;
  description: string;
  category: string;
  bg: string;
  surface: string;
  primary: string;
  accent: string;
  fontDisplay: string;
  fontBody: string;
  heroHeading: string;
  heroSubheading: string;
  services: string[];
}

// Категории на русском
const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  restaurant_modern:    { label: 'Ресторан',        icon: '🍽️' },
  barbershop_classic:   { label: 'Барбершоп',       icon: '✂️' },
  beauty_salon:         { label: 'Салон красоты',   icon: '💅' },
  fitness_gym:          { label: 'Фитнес',          icon: '💪' },
  coffee_shop:          { label: 'Кофейня',         icon: '☕' },
  bakery:               { label: 'Пекарня',         icon: '🥐' },
  spa_center:           { label: 'СПА',             icon: '🧖' },
  yoga_studio:          { label: 'Йога',            icon: '🧘' },
  dental_clinic:        { label: 'Стоматология',    icon: '🦷' },
  law_firm:             { label: 'Юридическая фирма', icon: '⚖️' },
  real_estate:          { label: 'Недвижимость',    icon: '🏠' },
  fashion_store:        { label: 'Магазин одежды',  icon: '👗' },
  jewelry_store:        { label: 'Ювелирный',       icon: '💎' },
  boutique_hotel:       { label: 'Отель',           icon: '🏨' },
  travel_agency:        { label: 'Турагентство',    icon: '✈️' },
  photographer_portfolio: { label: 'Фотограф',      icon: '📷' },
  wedding_photographer: { label: 'Свадебный фотограф', icon: '💒' },
  musician:             { label: 'Музыкант',        icon: '🎵' },
  personal_blog:        { label: 'Блог',            icon: '✍️' },
  online_courses:       { label: 'Онлайн-курсы',   icon: '🎓' },
  saas_startup:         { label: 'SaaS стартап',   icon: '🚀' },
  web_agency:           { label: 'Веб-агентство',  icon: '💻' },
  business_consulting:  { label: 'Консалтинг',     icon: '📊' },
  construction_company: { label: 'Строительство',  icon: '🏗️' },
  auto_service:         { label: 'Автосервис',     icon: '🔧' },
  logistics:            { label: 'Логистика',      icon: '🚚' },
  coworking_space:      { label: 'Коворкинг',      icon: '🏢' },
  kindergarten:         { label: 'Детский сад',    icon: '🧒' },
  non_profit:           { label: 'НКО',            icon: '🤝' },
  interior_designer:    { label: 'Дизайн интерьера', icon: '🛋️' },
  local_classifieds:    { label: 'Объявления',     icon: '📋' },
}

function getPresets(): PresetData[] {
  const presetsDir = path.join(process.cwd(), 'data', 'presets');
  try {
    const files = fs.readdirSync(presetsDir).filter(f => f.endsWith('.json'));
    return files.map(file => {
      const id = file.replace('.json', '');
      const data = JSON.parse(fs.readFileSync(path.join(presetsDir, file), 'utf8'));
      const t = data.design?.tokens || {};
      const content = data.content || {};

      // Берём заголовок hero на русском или английском
      const hero = content.hero?.ru || content.hero?.en || content.hero?.de || {}
      const heroHeading = hero.heading || data.meta?.title || id
      const heroSubheading = hero.subheading || data.meta?.description || ''

      // Берём названия услуг
      const services: string[] = []
      if (content.services?.length) {
        content.services.slice(0, 3).forEach((s: any) => {
          const name = s.name_ru || s.name_en || s.name_de || s.name || ''
          if (name) services.push(name)
        })
      }

      return {
        id,
        title: data.meta?.title || id,
        description: data.meta?.description || '',
        category: id,
        bg: t.colorBackground || '#ffffff',
        surface: t.colorSurface || '#f5f5f5',
        primary: t.colorPrimary || '#1a1a1a',
        accent: t.colorAccent || '#666666',
        fontDisplay: t.fontDisplay || 'serif',
        fontBody: t.fontBody || 'sans-serif',
        heroHeading,
        heroSubheading,
        services,
      }
    })
  } catch (e) {
    console.error('Error reading presets:', e)
    return []
  }
}

export default async function PresetsPage() {
  const presets = getPresets()

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>
          🎨 Шаблоны сайта
        </h1>
        <p style={{ color: '#666', fontSize: '15px' }}>
          {presets.length} готовых шаблонов. Выберите подходящий — он применится к вашему сайту.
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
      }}>
        {presets.map((preset) => {
          const cat = CATEGORY_LABELS[preset.id] || { label: preset.id, icon: '🌐' }
          const isDark = isColorDark(preset.bg)

          return (
            <div
              key={preset.id}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* ── ПРЕВЬЮ ── */}
              <div style={{
                height: '180px',
                background: preset.bg,
                position: 'relative',
                overflow: 'hidden',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                {/* Имитация навбара */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: preset.accent,
                    fontFamily: `'${preset.fontDisplay}', serif`,
                    letterSpacing: '0.5px',
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {preset.title.split('|')[0].trim()}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['', '', ''].map((_, i) => (
                      <div key={i} style={{
                        width: '24px', height: '4px',
                        borderRadius: '2px',
                        background: isDark
                          ? 'rgba(255,255,255,0.2)'
                          : 'rgba(0,0,0,0.12)',
                      }} />
                    ))}
                  </div>
                </div>

                {/* Hero текст */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: preset.primary,
                    fontFamily: `'${preset.fontDisplay}', serif`,
                    lineHeight: 1.3,
                    marginBottom: '6px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {preset.heroHeading}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
                    fontFamily: `'${preset.fontBody}', sans-serif`,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.4,
                    marginBottom: '10px',
                  }}>
                    {preset.heroSubheading}
                  </div>

                  {/* CTA кнопка */}
                  <div style={{
                    display: 'inline-block',
                    background: preset.accent,
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: '4px',
                    width: 'fit-content',
                    fontFamily: `'${preset.fontBody}', sans-serif`,
                  }}>
                    ● ● ●
                  </div>
                </div>

                {/* Имитация блоков контента внизу */}
                {preset.services.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginTop: '10px',
                  }}>
                    {preset.services.slice(0, 3).map((s, i) => (
                      <div key={i} style={{
                        flex: 1,
                        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                        borderRadius: '4px',
                        padding: '4px 6px',
                        fontSize: '8px',
                        color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontFamily: `'${preset.fontBody}', sans-serif`,
                      }}>
                        {s}
                      </div>
                    ))}
                  </div>
                )}

                {/* Цветовая полоска акцента снизу */}
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '3px',
                  background: preset.accent,
                }} />
              </div>

              {/* ── ИНФО ── */}
              <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Категория */}
                <div style={{
                  fontSize: '11px',
                  color: '#888',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </div>

                {/* Название */}
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111',
                  marginBottom: '4px',
                  lineHeight: 1.3,
                }}>
                  {preset.title.split('|')[0].trim()}
                </div>

                {/* Описание */}
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  lineHeight: 1.5,
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '12px',
                }}>
                  {preset.description}
                </div>

                {/* Цветовая палитра */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                  {[preset.bg, preset.surface, preset.primary, preset.accent].map((color, i) => (
                    <div
                      key={i}
                      title={color}
                      style={{
                        width: '18px', height: '18px',
                        borderRadius: '50%',
                        background: color,
                        border: '1px solid rgba(0,0,0,0.1)',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                  <span style={{ fontSize: '10px', color: '#aaa', marginLeft: '4px', alignSelf: 'center' }}>
                    {preset.fontDisplay}
                  </span>
                </div>

                {/* Кнопка */}
                <form action="/api/clone-preset" method="POST">
                  <input type="hidden" name="presetId" value={preset.id} />
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '9px',
                      background: preset.accent,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Применить шаблон
                  </button>
                </form>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Определяем тёмный фон для правильного цвета текста
function isColorDark(hex: string): boolean {
  const h = hex.replace('#', '')
  if (h.length < 6) return false
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  // Формула яркости
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}
