import fs from 'fs/promises'
import path from 'path'

export default async function FormsPage() {
  const formsPath = path.join(process.cwd(), 'data', 'forms', 'submissions.json')
  let submissions: any[] = []

  try {
    const content = await fs.readFile(formsPath, 'utf-8')
    submissions = JSON.parse(content)
  } catch {
    submissions = []
  }

  const newCount = submissions.filter(s => s.status === 'new').length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>
          📬 Заявки и сообщения
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Сообщения от посетителей вашего сайта через контактную форму
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>{submissions.length}</p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Всего заявок</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a', margin: '0 0 4px' }}>{newCount}</p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Новых</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#6b7280', margin: '0 0 4px' }}>{submissions.length - newCount}</p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Обработано</p>
        </div>
      </div>

      {/* Info */}
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '10px',
        padding: '14px 16px',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
        <p style={{ fontSize: '13px', color: '#166534', margin: 0 }}>
          Заявки сохраняются когда посетитель заполняет контактную форму на сайте.
          Также приходит уведомление на email и в Telegram (если настроено в переменных окружения).
        </p>
      </div>

      {/* List */}
      {submissions.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '60px 32px',
          textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>
            Заявок пока нет
          </p>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Когда посетители заполнят форму на сайте — заявки появятся здесь
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...submissions].reverse().map((sub) => (
            <div
              key={sub.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                borderLeft: `4px solid ${sub.status === 'new' ? '#22c55e' : '#e5e7eb'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: '0 0 2px' }}>
                    {sub.name}
                  </p>
                  <a
                    href={`mailto:${sub.email}`}
                    style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none' }}
                  >
                    {sub.email}
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: sub.status === 'new' ? '#dcfce7' : '#f3f4f6',
                    color: sub.status === 'new' ? '#166534' : '#6b7280',
                  }}>
                    {sub.status === 'new' ? '🟢 Новая' : '✓ Обработана'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {new Date(sub.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              {sub.message && (
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: 1.6,
                }}>
                  {sub.message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
