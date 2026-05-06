'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type AdminLang = 'ru' | 'de' | 'en'

const translations: Record<AdminLang, Record<string, string>> = {
  ru: {
    title: 'Админ-панель',
    dashboard: 'Дашборд',
    pages: 'Страницы',
    presets: 'Шаблоны',
    media: 'Медиа',
    design: 'Дизайн',
    forms: 'Заявки',
    menu: 'Меню',
    settings: 'Настройки',
    logout: 'Выйти',
    viewSite: 'Смотреть сайт',
  },
  de: {
    title: 'Admin-Panel',
    dashboard: 'Dashboard',
    pages: 'Seiten',
    presets: 'Vorlagen',
    media: 'Medien',
    design: 'Design',
    forms: 'Formulare',
    menu: 'Menü',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    viewSite: 'Webseite ansehen',
  },
  en: {
    title: 'Admin Panel',
    dashboard: 'Dashboard',
    pages: 'Pages',
    presets: 'Templates',
    media: 'Media',
    design: 'Design',
    forms: 'Forms',
    menu: 'Menu',
    settings: 'Settings',
    logout: 'Logout',
    viewSite: 'View Site',
  },
}

const navItems = [
  { key: 'dashboard', href: '/admin/dashboard', icon: '📊' },
  { key: 'presets',   href: '/admin/presets',   icon: '🎨' },
  { key: 'pages',     href: '/admin/pages',     icon: '📄' },
  { key: 'media',     href: '/admin/media',     icon: '🖼️' },
  { key: 'design',    href: '/admin/design',    icon: '✏️' },
  { key: 'forms',     href: '/admin/forms',     icon: '📬' },
  { key: 'menu',      href: '/admin/menu',      icon: '🔗' },
  { key: 'settings',  href: '/admin/settings',  icon: '⚙️' },
]

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [lang, setLang] = useState<AdminLang>('ru')

  // Загружаем язык из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('admin_lang') as AdminLang | null
    if (saved && ['ru', 'de', 'en'].includes(saved)) {
      setLang(saved)
    }
  }, [])

  const t = translations[lang]

  function changeLang(newLang: AdminLang) {
    setLang(newLang)
    localStorage.setItem('admin_lang', newLang)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-900">1universum</span>
              <span className="text-xs text-gray-400 hidden sm:block">{t.title}</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Language switcher */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {(['ru', 'de', 'en'] as AdminLang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => changeLang(l)}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                      lang === l
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* View site */}
              <a
                href="/de"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-200 hover:border-gray-300"
              >
                🌐 {t.viewSite}
              </a>

              {/* Logout */}
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded border border-red-200 hover:border-red-300"
                >
                  {t.logout}
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white shadow-sm flex-shrink-0">
          <nav className="py-4 px-2 space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{t[item.key]}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
