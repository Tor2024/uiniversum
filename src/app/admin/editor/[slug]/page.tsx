import { notFound } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'
import { blocksRegistry } from '@/lib/blocks-registry'

const BLOCK_ICONS: Record<string, string> = {
  hero: '🖼️', text_rich: '📝', image_single: '🖼️', image_gallery: '🗃️',
  video_embed: '▶️', cards_grid: '🃏', testimonials: '💬', faq: '❓',
  pricing: '💰', cta_banner: '📣', contact_form: '✉️', map_embed: '📍',
  countdown: '⏱️', stats: '📊', timeline: '📅', divider: '➖',
  logo_cloud: '🏢', team: '👥', blog_feed: '📰', menu_food: '🍽️',
  booking_form: '📆', custom_html: '💻',
}

const BLOCK_NAMES_RU: Record<string, string> = {
  hero: 'Hero-баннер', text_rich: 'Текст', image_single: 'Изображение',
  image_gallery: 'Галерея', video_embed: 'Видео', cards_grid: 'Карточки',
  testimonials: 'Отзывы', faq: 'FAQ', pricing: 'Цены', cta_banner: 'CTA-баннер',
  contact_form: 'Контактная форма', map_embed: 'Карта', countdown: 'Таймер',
  stats: 'Статистика', timeline: 'Хронология', divider: 'Разделитель',
  logo_cloud: 'Логотипы', team: 'Команда', blog_feed: 'Блог',
  menu_food: 'Меню ресторана', booking_form: 'Форма записи', custom_html: 'HTML-блок',
}

const BLOCK_DESC_RU: Record<string, string> = {
  hero: 'Главный баннер с заголовком, подзаголовком и кнопкой',
  text_rich: 'Форматированный текст с поддержкой HTML',
  image_single: 'Одиночное изображение на всю ширину',
  image_gallery: 'Сетка фотографий с лайтбоксом',
  video_embed: 'Встроенное видео YouTube или Vimeo',
  cards_grid: 'Сетка карточек с иконкой, заголовком и описанием',
  testimonials: 'Отзывы клиентов с именем и рейтингом',
  faq: 'Часто задаваемые вопросы с аккордеоном',
  pricing: 'Тарифные планы с перечнем функций',
  cta_banner: 'Призыв к действию с кнопкой',
  contact_form: 'Форма обратной связи',
  map_embed: 'Карта Google Maps с адресом',
  countdown: 'Обратный отсчёт до события',
  stats: 'Ключевые цифры и показатели',
  timeline: 'Хронология событий или шагов',
  divider: 'Горизонтальный разделитель',
  logo_cloud: 'Логотипы партнёров или клиентов',
  team: 'Команда с фото и должностями',
  blog_feed: 'Последние статьи или новости',
  menu_food: 'Меню ресторана с категориями и ценами',
  booking_form: 'Форма записи на услугу с выбором времени',
  custom_html: 'Произвольный HTML/CSS/JS код',
}

export default async function EditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), 'data', 'pages', `${slug}.json`)

  let pageData: any = null
  try {
    pageData = JSON.parse(await fs.readFile(filePath, 'utf-8'))
  } catch {
    notFound()
  }

  const groups = [
    { key: 'content', label: 'Контент', icon: '📝' },
    { key: 'media',   label: 'Медиа',   icon: '🖼️' },
    { key: 'forms',   label: 'Формы',   icon: '✉️' },
    { key: 'special', label: 'Особые',  icon: '⭐' },
  ]

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── LEFT: Block library ── */}
      <aside style={{
        width: '240px',
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        overflowY: 'auto',
        flexShrink: 0,
      }}>
        <div style={{ padding: '16px 12px 8px', borderBottom: '1px solid #f3f4f6' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>
            Добавить блок
          </p>
        </div>

        {groups.map(group => {
          const items = blocksRegistry.filter(b => b.group === group.key)
          return (
            <div key={group.key}>
              <div style={{ padding: '10px 12px 4px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', margin: 0 }}>
                  {group.icon} {group.label}
                </p>
              </div>
              {items.map(block => (
                <div
                  key={block.type}
                  title={BLOCK_DESC_RU[block.type] || block.description}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    margin: '0 4px',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '16px', flexShrink: 0 }}>{BLOCK_ICONS[block.type] || '📦'}</span>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#374151', margin: 0 }}>
                      {BLOCK_NAMES_RU[block.type] || block.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </aside>

      {/* ── CENTER: Canvas ── */}
      <main style={{ flex: 1, overflowY: 'auto', background: '#f3f4f6', padding: '24px' }}>
        {/* Page title */}
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Редактор страницы
            </p>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111', margin: 0 }}>
              {pageData.title?.ru || pageData.title?.de || pageData.title?.en || slug}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={`/de`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '8px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#374151',
                textDecoration: 'none',
                background: '#fff',
              }}
            >
              👁 Предпросмотр
            </a>
            <button style={{
              padding: '8px 16px',
              background: '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              🚀 Опубликовать
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#1e40af',
          display: 'flex',
          gap: '8px',
        }}>
          <span>💡</span>
          <span>
            Редактор блоков в разработке. Сейчас вы видите список блоков страницы.
            Для изменения контента отредактируйте файл <code style={{ background: '#dbeafe', padding: '1px 5px', borderRadius: '3px' }}>data/pages/{slug}.json</code> и нажмите «Опубликовать».
          </span>
        </div>

        {/* Blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(pageData.blocks || []).map((block: any, i: number) => (
            <div
              key={block.id}
              style={{
                background: '#fff',
                borderRadius: '10px',
                padding: '14px 16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                border: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: block.visible ? 1 : 0.5,
              }}
            >
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{BLOCK_ICONS[block.type] || '📦'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', margin: 0 }}>
                    {BLOCK_NAMES_RU[block.type] || block.type}
                  </p>
                  {!block.visible && (
                    <span style={{ fontSize: '11px', color: '#9ca3af', background: '#f3f4f6', padding: '1px 6px', borderRadius: '4px' }}>
                      скрыт
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0' }}>
                  #{i + 1} · ID: {block.id}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button style={{
                  padding: '5px 10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#374151',
                  background: '#fff',
                  cursor: 'pointer',
                }}>
                  ✏️ Изменить
                </button>
                <button style={{
                  padding: '5px 10px',
                  border: '1px solid #fee2e2',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#ef4444',
                  background: '#fff',
                  cursor: 'pointer',
                }}>
                  🗑
                </button>
              </div>
            </div>
          ))}

          {/* Add block button */}
          <button style={{
            padding: '16px',
            border: '2px dashed #d1d5db',
            borderRadius: '10px',
            background: 'transparent',
            color: '#9ca3af',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.15s',
          }}>
            + Добавить блок (выберите из панели слева)
          </button>
        </div>
      </main>

      {/* ── RIGHT: Settings ── */}
      <aside style={{
        width: '260px',
        background: '#fff',
        borderLeft: '1px solid #e5e7eb',
        overflowY: 'auto',
        flexShrink: 0,
        padding: '16px',
      }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
          Настройки страницы
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Статус
            </label>
            <div style={{
              padding: '8px 12px',
              background: pageData.status === 'published' ? '#dcfce7' : '#fef9c3',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: pageData.status === 'published' ? '#166534' : '#854d0e',
            }}>
              {pageData.status === 'published' ? '✓ Опубликована' : '⏳ Черновик'}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              URL страницы
            </label>
            <div style={{
              padding: '8px 12px',
              background: '#f9fafb',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#6b7280',
              fontFamily: 'monospace',
            }}>
              /{pageData.slug}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Блоков на странице
            </label>
            <div style={{
              padding: '8px 12px',
              background: '#f9fafb',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: 700,
              color: '#111',
            }}>
              {pageData.blocks?.length || 0}
            </div>
          </div>

          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '12px',
            color: '#6b7280',
            lineHeight: 1.6,
          }}>
            <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>💡 Подсказка</p>
            Выберите блок из левой панели чтобы добавить его на страницу.
            Перетащите блоки для изменения порядка.
          </div>
        </div>
      </aside>
    </div>
  )
}
