import Link from 'next/link'
import siteData from '../../../../data/site.json'
import homeData from '../../../../data/pages/home.json'

export default async function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <p className="mt-1 text-sm text-gray-500">
          Добро пожаловать в панель управления сайтом
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Site Info */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <span className="text-2xl">🌐</span>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Название сайта</dt>
                  <dd className="text-lg font-medium text-gray-900">{siteData.meta.title}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link href="/admin/settings" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Настройки →
            </Link>
          </div>
        </div>

        {/* Pages */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <span className="text-2xl">📄</span>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Страницы</dt>
                  <dd className="text-lg font-medium text-gray-900">1 опубликована</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link href="/admin/pages" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Управление страницами →
            </Link>
          </div>
        </div>

        {/* Blocks */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <span className="text-2xl">🧱</span>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Блоков на главной</dt>
                  <dd className="text-lg font-medium text-gray-900">{homeData.blocks.length}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link href="/admin/editor/home" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Редактировать главную →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/presets"
            className="flex items-center gap-2 px-4 py-3 border-2 border-indigo-200 text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
          >
            🎨 Выбрать шаблон
          </Link>
          <Link
            href="/admin/editor/home"
            className="flex items-center gap-2 px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
          >
            ✏️ Редактировать сайт
          </Link>
          <Link
            href="/admin/design"
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            🖌️ Изменить дизайн
          </Link>
          <Link
            href="/admin/media"
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            🖼️ Загрузить медиа
          </Link>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm font-medium text-blue-800">Начните с выбора шаблона</p>
            <p className="text-sm text-blue-600 mt-1">
              Перейдите в раздел <Link href="/admin/presets" className="underline font-medium">Шаблоны</Link> — там 30 готовых дизайнов для разных видов бизнеса. Выберите подходящий и настройте под себя.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
