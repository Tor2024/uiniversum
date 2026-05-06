import Link from 'next/link'
import '../globals.css'

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-100">
        {/* Admin Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">CMS Admin</h1>
              </div>
              <nav className="flex space-x-4">
                <form action="/api/auth/logout" method="POST">
                  <button 
                    type="submit"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </form>
              </nav>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)]">
            <nav className="mt-5 px-2">
              <Link 
                href="/admin/dashboard"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/pages"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                Pages
              </Link>
              <Link 
                href="/admin/presets"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                Presets
              </Link>
              <Link 
                href="/admin/media"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                Media
              </Link>
              <Link 
                href="/admin/design"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                Design
              </Link>
              <Link 
                href="/admin/forms"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                Forms
              </Link>
              <Link 
                href="/admin/settings"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                Settings
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}