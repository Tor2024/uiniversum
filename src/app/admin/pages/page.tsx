import Link from 'next/link'
import fs from 'fs/promises'
import path from 'path'

export default async function PagesPage() {
  const pagesDir = path.join(process.cwd(), 'data', 'pages')
  let pages: any[] = []

  try {
    const files = await fs.readdir(pagesDir)
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(pagesDir, file), 'utf-8')
        pages.push(JSON.parse(content))
      }
    }
  } catch (error) {
    console.error('Error reading pages:', error)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>
            📄 Страницы сайта
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Управляйте страницами вашего сайта. Нажмите на страницу чтобы редактировать её блоки.
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '10px',
        padding: '14px 16px',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af', margin: '0 0 2px' }}>
            Как работают страницы?
          </p>
          <p style={{ fontSize: '13px', color: '#3b82f6', margin: 0 }}>
            Каждая страница состоит из блоков — Hero, Текст, Галерея, Форма и т.д.
            Нажмите «Редактировать» чтобы добавлять, удалять и настраивать блоки.
            После изменений нажмите «Опубликовать» — сайт обновится автоматически.
          </p>
        </div>
      </div>

      {/* Pages list */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {pages.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <p style={{ fontSize: '15px', fontWeight: 500 }}>Страниц пока нет</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>
              Выберите шаблон в разделе{' '}
              <Link href="/admin/presets" style={{ color: '#6366f1', textDecoration: 'underline' }}>
                Шаблоны
              </Link>{' '}
              — страницы создадутся автоматически
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {pages.map((page, i) => (
              <li
                key={page.slug}
                style={{
                  borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <Link
                  href={`/admin/editor/${page.slug}`}
                  style={{ display: 'block', padding: '16px 20px', textDecoration: 'none', transition: 'background 0.15s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>
                        {page.slug === 'home' ? '🏠' : '📄'}
                      </span>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: '#111', margin: '0 0 2px' }}>
                          {page.title?.ru || page.title?.de || page.title?.en || page.slug}
                        </p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                          /{page.slug} · {page.blocks?.length || 0} блоков
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: page.status === 'published' ? '#dcfce7' : '#fef9c3',
                        color: page.status === 'published' ? '#166534' : '#854d0e',
                      }}>
                        {page.status === 'published' ? '✓ Опубликована' : '⏳ Черновик'}
                      </span>
                      <span style={{
                        padding: '6px 14px',
                        background: '#6366f1',
                        color: '#fff',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}>
                        Редактировать →
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
