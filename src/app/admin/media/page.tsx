import fs from 'fs/promises'
import path from 'path'

export default async function MediaPage() {
  const mediaDir = path.join(process.cwd(), 'public', 'media')
  let mediaFiles: any[] = []

  try {
    const exists = await fs.access(mediaDir).then(() => true).catch(() => false)
    if (exists) {
      const files = await fs.readdir(mediaDir)
      mediaFiles = files
        .filter(f => /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i.test(f))
        .map(file => ({ filename: file, path: `/media/${file}` }))
    }
  } catch (error) {
    console.error('Error reading media:', error)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>
            🖼️ Медиатека
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Изображения и файлы вашего сайта
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div style={{
        background: '#fff7ed',
        border: '1px solid #fed7aa',
        borderRadius: '10px',
        padding: '14px 16px',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#9a3412', margin: '0 0 2px' }}>
            Важно: загрузка файлов на Vercel
          </p>
          <p style={{ fontSize: '13px', color: '#c2410c', margin: 0 }}>
            На Vercel файлы нельзя сохранять локально — они исчезнут при следующем деплое.
            Для постоянного хранения изображений используйте внешние сервисы:
            <strong> Cloudinary, Uploadthing или GitHub</strong> (через кнопку «Опубликовать»).
          </p>
        </div>
      </div>

      {/* Upload area */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        padding: '32px',
        textAlign: 'center',
        border: '2px dashed #e5e7eb',
        marginBottom: '20px',
        cursor: 'pointer',
      }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📤</div>
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>
          Загрузить изображение
        </p>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 16px' }}>
          JPG, PNG, WebP, SVG · Максимум 5 МБ
        </p>
        <form action="/api/upload" method="POST" encType="multipart/form-data">
          <label style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: '#6366f1',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Выбрать файл
            <input type="file" name="file" accept="image/*,.pdf" style={{ display: 'none' }} />
          </label>
        </form>
      </div>

      {/* Files grid */}
      {mediaFiles.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          color: '#9ca3af',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗂️</div>
          <p style={{ fontSize: '15px', fontWeight: 500, color: '#6b7280' }}>Файлов пока нет</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>
            Загрузите первое изображение с помощью формы выше
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px',
        }}>
          {mediaFiles.map((file) => (
            <div
              key={file.filename}
              style={{
                background: '#fff',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: '1px solid #f3f4f6',
              }}
            >
              <div style={{
                height: '120px',
                background: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.path}
                  alt={file.filename}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                  onError={() => {}}
                />
              </div>
              <div style={{ padding: '8px 10px' }}>
                <p style={{
                  fontSize: '11px',
                  color: '#374151',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {file.filename}
                </p>
                <button
                  style={{
                    marginTop: '6px',
                    fontSize: '11px',
                    color: '#6b7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  onClick={() => navigator.clipboard?.writeText(file.path)}
                >
                  📋 Скопировать путь
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
