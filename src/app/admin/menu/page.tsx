import fs from 'fs/promises'
import path from 'path'

export default async function MenuPage() {
  const navPath = path.join(process.cwd(), 'data', 'navigation.json')
  let navData: any = { header: [], footer: [] }

  try {
    const content = await fs.readFile(navPath, 'utf-8')
    navData = JSON.parse(content)
  } catch {
    navData = { header: [], footer: [] }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>
          🔗 Навигация
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Ссылки в шапке и подвале вашего сайта
        </p>
      </div>

      {/* Info */}
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
            Как работает навигация?
          </p>
          <p style={{ fontSize: '13px', color: '#3b82f6', margin: 0 }}>
            Ссылки в шапке (Header) отображаются в верхнем меню сайта.
            Ссылки в подвале (Footer) — внизу страницы.
            Редактирование навигации через интерфейс будет доступно в следующей версии.
            Сейчас можно редактировать файл <code style={{ background: '#dbeafe', padding: '1px 5px', borderRadius: '3px' }}>data/navigation.json</code> напрямую.
          </p>
        </div>
      </div>

      {/* Header nav */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 2px' }}>
              Шапка сайта (Header)
            </h2>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
              Главное меню — отображается на всех страницах вверху
            </p>
          </div>
          <span style={{
            padding: '4px 12px',
            background: '#f3f4f6',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#6b7280',
          }}>
            {navData.header.length} ссылок
          </span>
        </div>

        {navData.header.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
            Ссылок пока нет
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navData.header.map((item: any, i: number) => (
              <div
                key={item.id || i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #f3f4f6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>🔗</span>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', margin: '0 0 1px' }}>
                      {item.label?.ru || item.label?.de || item.label?.en || item.id}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{item.url}</p>
                  </div>
                </div>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: item.visible ? '#dcfce7' : '#f3f4f6',
                  color: item.visible ? '#166534' : '#9ca3af',
                }}>
                  {item.visible ? '✓ Видна' : 'Скрыта'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 2px' }}>
              Подвал сайта (Footer)
            </h2>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
              Ссылки внизу страницы — обычно Контакты, Политика, Impressum
            </p>
          </div>
          <span style={{
            padding: '4px 12px',
            background: '#f3f4f6',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#6b7280',
          }}>
            {navData.footer.length} ссылок
          </span>
        </div>

        {navData.footer.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
            Ссылок пока нет
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navData.footer.map((item: any, i: number) => (
              <div
                key={item.id || i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', margin: '0 0 1px' }}>
                    {item.label?.ru || item.label?.de || item.label?.en || item.id}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{item.url}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
