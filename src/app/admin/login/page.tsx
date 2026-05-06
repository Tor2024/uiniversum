import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function LoginPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  const expectedHash = process.env.ADMIN_TOKEN_HASH
  if (token === expectedHash) redirect('/admin/dashboard')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        margin: '0 16px',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px 32px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🌐</div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>
            1universum
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '4px' }}>
            Панель управления сайтом
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '32px' }}>
          <form action="/api/auth" method="POST">
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}
              >
                Пароль для входа
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                placeholder="Введите пароль..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '15px',
                  color: '#111',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.3px',
              }}
            >
              Войти в панель управления →
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '20px' }}>
            Забыли пароль? Он задаётся в переменной<br />
            <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>ADMIN_PASSWORD_HASH</code> на Vercel
          </p>
        </div>
      </div>
    </div>
  )
}
