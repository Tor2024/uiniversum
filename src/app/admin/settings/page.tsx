import fs from 'fs/promises'
import path from 'path'

export default async function SettingsPage() {
  const sitePath = path.join(process.cwd(), 'data', 'site.json')
  let siteData: any = {}

  try {
    const content = await fs.readFile(sitePath, 'utf-8')
    siteData = JSON.parse(content)
  } catch {
    siteData = {}
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>
          ⚙️ Настройки сайта
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Основные параметры, SEO и публикация
        </p>
      </div>

      {/* Info */}
      <div style={{
        background: '#fff7ed',
        border: '1px solid #fed7aa',
        borderRadius: '10px',
        padding: '14px 16px',
        marginBottom: '24px',
        display: 'flex',
        gap: '10px',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
        <p style={{ fontSize: '13px', color: '#9a3412', margin: 0 }}>
          Сохранение настроек через интерфейс будет доступно в следующей версии.
          Сейчас изменения вносятся в файл <code style={{ background: '#fed7aa', padding: '1px 5px', borderRadius: '3px' }}>data/site.json</code> и публикуются через GitHub.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* General */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 4px' }}>
            Основное
          </h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 16px' }}>
            Название и описание отображаются во вкладке браузера и в поисковиках
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Название сайта
              </label>
              <input
                type="text"
                defaultValue={siteData.meta?.title || ''}
                readOnly
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: '#f9fafb',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>
                Отображается во вкладке браузера и в результатах поиска Google
              </p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Описание сайта (meta description)
              </label>
              <textarea
                defaultValue={siteData.meta?.description || ''}
                readOnly
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: '#f9fafb',
                  boxSizing: 'border-box',
                  resize: 'none',
                }}
              />
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>
                Краткое описание для поисковиков. Оптимально: 120–160 символов
              </p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Язык сайта по умолчанию
              </label>
              <div style={{
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                background: '#f9fafb',
              }}>
                {siteData.meta?.language === 'de' ? '🇩🇪 Немецкий' :
                 siteData.meta?.language === 'en' ? '🇬🇧 Английский' :
                 siteData.meta?.language === 'ru' ? '🇷🇺 Русский' :
                 siteData.meta?.language || 'de'}
              </div>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 4px' }}>
            SEO и аналитика
          </h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 16px' }}>
            Настройки для поисковых систем и отслеживания посещаемости
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                OG Image (картинка для соцсетей)
              </label>
              <input
                type="text"
                defaultValue={siteData.seo?.ogImage || ''}
                readOnly
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: '#f9fafb',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>
                Показывается при репосте ссылки в WhatsApp, Telegram, Facebook. Размер: 1200×630px
              </p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Google Analytics ID
              </label>
              <input
                type="text"
                defaultValue={siteData.seo?.googleAnalyticsId || ''}
                readOnly
                placeholder="G-XXXXXXXXXX"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: '#f9fafb',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>
                Получите ID на <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>analytics.google.com</a> для отслеживания посещаемости
              </p>
            </div>
          </div>
        </div>

        {/* Publish */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 4px' }}>
            🚀 Публикация
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
            Нажмите кнопку чтобы сохранить все изменения в GitHub и запустить обновление сайта на Vercel.
            Обновление занимает около 1–2 минут.
          </p>
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#166534',
          }}>
            ✓ Репозиторий: <strong>Tor2024/uiniversum</strong> · Ветка: <strong>master</strong>
          </div>
          <button
            type="button"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.3px',
            }}
          >
            🚀 Опубликовать сайт
          </button>
        </div>

      </div>
    </div>
  )
}
