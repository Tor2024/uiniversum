import fs from 'fs';
import path from 'path';

interface PresetData {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  category: string;
  categoryIcon: string;
  bg: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  fontDisplay: string;
  fontBody: string;
  heroHeading: string;
  heroSubheading: string;
  heroCta: string;
  services: { name: string; price: string }[];
  testimonial: { text: string; name: string };
  stats: { value: string; label: string }[];
  logoText: string;
  logoTagline: string;
  navLinks: string[];
}

const CATEGORIES: Record<string, { label: string; icon: string }> = {
  restaurant_modern:      { label: 'Ресторан',           icon: '🍽️' },
  barbershop_classic:     { label: 'Барбершоп',          icon: '✂️' },
  beauty_salon:           { label: 'Салон красоты',      icon: '💅' },
  fitness_gym:            { label: 'Фитнес-клуб',        icon: '💪' },
  coffee_shop:            { label: 'Кофейня',            icon: '☕' },
  bakery:                 { label: 'Пекарня',            icon: '🥐' },
  spa_center:             { label: 'СПА & Велнес',       icon: '🧖' },
  yoga_studio:            { label: 'Йога-студия',        icon: '🧘' },
  dental_clinic:          { label: 'Стоматология',       icon: '🦷' },
  law_firm:               { label: 'Юридическая фирма',  icon: '⚖️' },
  real_estate:            { label: 'Недвижимость',       icon: '🏠' },
  fashion_store:          { label: 'Магазин одежды',     icon: '👗' },
  jewelry_store:          { label: 'Ювелирный магазин',  icon: '💎' },
  boutique_hotel:         { label: 'Бутик-отель',        icon: '🏨' },
  travel_agency:          { label: 'Турагентство',       icon: '✈️' },
  photographer_portfolio: { label: 'Фотограф',           icon: '📷' },
  wedding_photographer:   { label: 'Свадебный фотограф', icon: '💒' },
  musician:               { label: 'Музыкант',           icon: '🎵' },
  personal_blog:          { label: 'Личный блог',        icon: '✍️' },
  online_courses:         { label: 'Онлайн-курсы',       icon: '🎓' },
  saas_startup:           { label: 'SaaS стартап',       icon: '🚀' },
  web_agency:             { label: 'Веб-агентство',      icon: '💻' },
  business_consulting:    { label: 'Консалтинг',         icon: '📊' },
  construction_company:   { label: 'Строительство',      icon: '🏗️' },
  auto_service:           { label: 'Автосервис',         icon: '🔧' },
  logistics:              { label: 'Логистика',          icon: '🚚' },
  coworking_space:        { label: 'Коворкинг',          icon: '🏢' },
  kindergarten:           { label: 'Детский сад',        icon: '🧒' },
  non_profit:             { label: 'НКО / Фонд',         icon: '🤝' },
  interior_designer:      { label: 'Дизайн интерьера',   icon: '🛋️' },
  local_classifieds:      { label: 'Доска объявлений',   icon: '📋' },
}

const DEFAULT_STATS: Record<string, { value: string; label: string }[]> = {
  restaurant_modern:   [{ value: '200+', label: 'Блюд в меню' }, { value: '15', label: 'Лет опыта' }, { value: '4.9★', label: 'Рейтинг' }],
  barbershop_classic:  [{ value: '5000+', label: 'Клиентов' }, { value: '8', label: 'Мастеров' }, { value: '10', label: 'Лет работы' }],
  fitness_gym:         [{ value: '1200+', label: 'Членов' }, { value: '50+', label: 'Классов/нед' }, { value: '20', label: 'Тренеров' }],
  beauty_salon:        [{ value: '3000+', label: 'Клиентов' }, { value: '12', label: 'Мастеров' }, { value: '5★', label: 'Рейтинг' }],
  spa_center:          [{ value: '15+', label: 'Процедур' }, { value: '8', label: 'Лет опыта' }, { value: '4.9★', label: 'Рейтинг' }],
  dental_clinic:       [{ value: '10000+', label: 'Пациентов' }, { value: '15', label: 'Врачей' }, { value: '20', label: 'Лет работы' }],
  law_firm:            [{ value: '500+', label: 'Дел выиграно' }, { value: '95%', label: 'Успех' }, { value: '15', label: 'Лет опыта' }],
  real_estate:         [{ value: '1200+', label: 'Объектов' }, { value: '98%', label: 'Довольных' }, { value: '12', label: 'Лет работы' }],
  saas_startup:        [{ value: '10K+', label: 'Пользователей' }, { value: '99.9%', label: 'Uptime' }, { value: '4.8★', label: 'Рейтинг' }],
}

function getDefaultStats(id: string) {
  return DEFAULT_STATS[id] || [
    { value: '500+', label: 'Клиентов' },
    { value: '5★', label: 'Рейтинг' },
    { value: '10', label: 'Лет опыта' },
  ]
}

function getDefaultNavLinks(id: string): string[] {
  const maps: Record<string, string[]> = {
    restaurant_modern:   ['Меню', 'О нас', 'Бронь', 'Контакты'],
    barbershop_classic:  ['Услуги', 'Цены', 'Запись', 'Контакты'],
    fitness_gym:         ['Тренировки', 'Цены', 'Тренеры', 'Контакты'],
    beauty_salon:        ['Услуги', 'Мастера', 'Запись', 'Контакты'],
    spa_center:          ['Процедуры', 'Цены', 'Запись', 'Контакты'],
    dental_clinic:       ['Услуги', 'Врачи', 'Запись', 'Контакты'],
    law_firm:            ['Практика', 'Команда', 'Кейсы', 'Контакты'],
    real_estate:         ['Объекты', 'Услуги', 'О нас', 'Контакты'],
    saas_startup:        ['Функции', 'Цены', 'Блог', 'Войти'],
    web_agency:          ['Услуги', 'Портфолио', 'О нас', 'Контакты'],
  }
  return maps[id] || ['Главная', 'Услуги', 'О нас', 'Контакты']
}

function getPresets(): PresetData[] {
  const presetsDir = path.join(process.cwd(), 'data', 'presets')
  try {
    const files = fs.readdirSync(presetsDir).filter(f => f.endsWith('.json'))
    return files.map(file => {
      const id = file.replace('.json', '')
      const data = JSON.parse(fs.readFileSync(path.join(presetsDir, file), 'utf8'))
      const t = data.design?.tokens || {}
      const content = data.content || {}
      const cat = CATEGORIES[id] || { label: id, icon: '🌐' }

      const hero = content.hero?.ru || content.hero?.de || content.hero?.en || {}
      const heroHeading = hero.heading || data.meta?.title?.split('|')[0]?.trim() || id
      const heroSubheading = hero.subheading || data.meta?.description || ''
      const heroCta = hero.cta || 'Подробнее'

      const services: { name: string; price: string }[] = []
      const src = content.services || content.menu || []
      if (Array.isArray(src)) {
        src.slice(0, 3).forEach((s: any) => {
          const items = s.items || [s]
          items.slice(0, 1).forEach((item: any) => {
            const name = item.name_ru || item.name_de || item.name_en || item.name || ''
            const price = item.price || ''
            if (name) services.push({ name, price })
          })
        })
      }
      if (services.length === 0 && Array.isArray(content.services)) {
        content.services.slice(0, 3).forEach((s: any) => {
          const name = s.name_ru || s.name_de || s.name_en || ''
          if (name) services.push({ name, price: s.price || '' })
        })
      }

      const testimonialSrc = content.testimonials?.[0]
      const testimonial = testimonialSrc ? {
        text: testimonialSrc.text_ru || testimonialSrc.text_de || testimonialSrc.text_en || '',
        name: testimonialSrc.name || '',
      } : { text: '', name: '' }

      const titleFull = data.meta?.title || id
      const titleParts = titleFull.split('|')
      const shortTitle = titleParts[0]?.trim() || id
      const tagline = titleParts[1]?.trim() || cat.label

      return {
        id,
        title: titleFull,
        shortTitle,
        tagline,
        description: data.meta?.description || '',
        category: id,
        categoryIcon: cat.icon,
        categoryLabel: cat.label,
        bg: t.colorBackground || '#ffffff',
        surface: t.colorSurface || '#f5f5f5',
        primary: t.colorPrimary || '#1a1a1a',
        secondary: t.colorSecondary || '#666',
        accent: t.colorAccent || '#333',
        border: t.colorBorder || '#e5e5e5',
        fontDisplay: t.fontDisplay || 'serif',
        fontBody: t.fontBody || 'sans-serif',
        heroHeading,
        heroSubheading,
        heroCta,
        services,
        testimonial,
        stats: getDefaultStats(id),
        logoText: data.logo?.text || shortTitle,
        logoTagline: data.logo?.tagline || '',
        navLinks: getDefaultNavLinks(id),
      } as PresetData
    })
  } catch (e) {
    console.error('Error reading presets:', e)
    return []
  }
}

function isDark(hex: string): boolean {
  const h = hex.replace('#', '')
  if (h.length < 6) return false
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 140
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + '…' : str
}

export default async function PresetsPage() {
  const presets = getPresets()

  return (
    <div style={{ padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111', margin: '0 0 6px' }}>
          🎨 Выберите шаблон сайта
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
          {presets.length} готовых шаблонов для разных видов бизнеса. Нажмите «Применить» — сайт обновится автоматически.
        </p>
      </div>

      {/* Info */}
      <div style={{
        background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px',
        padding: '14px 16px', marginBottom: '28px', display: 'flex', gap: '10px',
      }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <p style={{ fontSize: '13px', color: '#1e40af', margin: 0 }}>
          Каждый шаблон содержит готовый контент, цветовую схему и шрифты.
          После применения вы сможете отредактировать тексты и изображения в разделе <strong>Страницы → Редактировать</strong>.
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
      }}>
        {presets.map((p) => {
          const dark = isDark(p.bg)
          const textColor = dark ? 'rgba(255,255,255,0.9)' : p.primary
          const subColor = dark ? 'rgba(255,255,255,0.55)' : p.secondary
          const borderColor = dark ? 'rgba(255,255,255,0.1)' : p.border

          return (
            <div key={p.id} style={{
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 2px 16px rgba(0,0,0,0.09)',
              border: '1px solid #e5e7eb',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}>

              {/* ══ PREVIEW MOCKUP ══ */}
              <div style={{
                height: '220px',
                background: p.bg,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}>

                {/* Navbar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderBottom: `1px solid ${borderColor}`,
                  background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(4px)',
                  flexShrink: 0,
                }}>
                  {/* Logo */}
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: p.accent,
                      fontFamily: `'${p.fontDisplay}', serif`,
                      letterSpacing: '0.3px',
                    }}>
                      {truncate(p.logoText, 12)}
                    </span>
                    {p.logoTagline && (
                      <span style={{ fontSize: '7px', color: subColor, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {truncate(p.logoTagline, 14)}
                      </span>
                    )}
                  </div>
                  {/* Nav links */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {p.navLinks.slice(0, 3).map((link, i) => (
                      <span key={i} style={{ fontSize: '8px', color: subColor, fontFamily: `'${p.fontBody}', sans-serif` }}>
                        {link}
                      </span>
                    ))}
                    <div style={{
                      background: p.accent,
                      color: '#fff',
                      fontSize: '7px',
                      padding: '3px 7px',
                      borderRadius: '3px',
                      fontWeight: 600,
                    }}>
                      {p.navLinks[3] || 'Контакты'}
                    </div>
                  </div>
                </div>

                {/* Hero section */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '12px 14px 8px',
                  background: dark
                    ? `linear-gradient(135deg, ${p.bg} 0%, ${p.surface} 100%)`
                    : `linear-gradient(135deg, ${p.bg} 0%, ${p.surface}88 100%)`,
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: textColor,
                    fontFamily: `'${p.fontDisplay}', serif`,
                    lineHeight: 1.25,
                    marginBottom: '5px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {p.heroHeading}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    color: subColor,
                    fontFamily: `'${p.fontBody}', sans-serif`,
                    lineHeight: 1.5,
                    marginBottom: '10px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {p.heroSubheading}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <div style={{
                      background: p.accent,
                      color: '#fff',
                      fontSize: '8px',
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: '4px',
                      fontFamily: `'${p.fontBody}', sans-serif`,
                    }}>
                      {truncate(p.heroCta, 18)}
                    </div>
                    <div style={{
                      border: `1px solid ${dark ? 'rgba(255,255,255,0.3)' : p.accent}`,
                      color: dark ? 'rgba(255,255,255,0.7)' : p.accent,
                      fontSize: '8px',
                      padding: '4px 10px',
                      borderRadius: '4px',
                    }}>
                      Подробнее
                    </div>
                  </div>
                </div>

                {/* Services strip */}
                {p.services.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    padding: '6px 10px',
                    background: dark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)',
                    borderTop: `1px solid ${borderColor}`,
                    flexShrink: 0,
                  }}>
                    {p.services.slice(0, 3).map((s, i) => (
                      <div key={i} style={{
                        flex: 1,
                        background: dark ? 'rgba(255,255,255,0.07)' : p.surface,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '4px',
                        padding: '4px 6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1px',
                      }}>
                        <span style={{
                          fontSize: '7.5px',
                          fontWeight: 600,
                          color: textColor,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontFamily: `'${p.fontBody}', sans-serif`,
                        }}>
                          {s.name}
                        </span>
                        {s.price && (
                          <span style={{ fontSize: '7px', color: p.accent, fontWeight: 700 }}>
                            {s.price}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Stats bar */}
                <div style={{
                  display: 'flex',
                  borderTop: `1px solid ${borderColor}`,
                  background: dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)',
                  flexShrink: 0,
                }}>
                  {p.stats.map((stat, i) => (
                    <div key={i} style={{
                      flex: 1,
                      padding: '5px 4px',
                      textAlign: 'center',
                      borderRight: i < p.stats.length - 1 ? `1px solid ${borderColor}` : 'none',
                    }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: p.accent }}>{stat.value}</div>
                      <div style={{ fontSize: '6.5px', color: subColor }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Accent bottom line */}
                <div style={{ height: '3px', background: p.accent, flexShrink: 0 }} />
              </div>

              {/* ══ CARD INFO ══ */}
              <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Category */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px' }}>{p.categoryIcon}</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
                    {(CATEGORIES[p.id] || { label: p.id }).label}
                  </span>
                </div>

                {/* Title */}
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '4px', lineHeight: 1.3 }}>
                  {p.shortTitle}
                </div>

                {/* Description */}
                <div style={{
                  fontSize: '12px', color: '#6b7280', lineHeight: 1.5, flex: 1,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  overflow: 'hidden', marginBottom: '12px',
                }}>
                  {p.description}
                </div>

                {/* Testimonial */}
                {p.testimonial.text && (
                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    marginBottom: '12px',
                    borderLeft: `3px solid ${p.accent}`,
                  }}>
                    <p style={{
                      fontSize: '11px', color: '#374151', margin: '0 0 3px', lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      «{p.testimonial.text}»
                    </p>
                    <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>— {p.testimonial.name}</p>
                  </div>
                )}

                {/* Color palette */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                  {[p.bg, p.surface, p.primary, p.accent].map((color, i) => (
                    <div key={i} title={color} style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      background: color, border: '1.5px solid rgba(0,0,0,0.08)', flexShrink: 0,
                    }} />
                  ))}
                  <span style={{ fontSize: '10px', color: '#9ca3af', marginLeft: '4px' }}>
                    {p.fontDisplay}
                  </span>
                </div>

                {/* Apply button */}
                <form action="/api/clone-preset" method="POST">
                  <input type="hidden" name="presetId" value={p.id} />
                  <button type="submit" style={{
                    width: '100%',
                    padding: '10px',
                    background: p.accent,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.2px',
                  }}>
                    Применить шаблон →
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
