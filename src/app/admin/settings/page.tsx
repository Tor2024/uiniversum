import fs from 'fs/promises'
import path from 'path'

export default async function SettingsPage() {
  const sitePath = path.join(process.cwd(), 'data', 'site.json')
  let siteData: any = {}

  try {
    const content = await fs.readFile(sitePath, 'utf-8')
    siteData = JSON.parse(content)
  } catch (error) {
    console.error('Error reading site data:', error)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your website settings
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="site-title" className="block text-sm font-medium text-gray-700 mb-1">
                Site Title
              </label>
              <input
                id="site-title"
                type="text"
                defaultValue={siteData.meta?.title || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="My Website"
              />
            </div>
            <div>
              <label htmlFor="site-description" className="block text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <textarea
                id="site-description"
                defaultValue={siteData.meta?.description || ''}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="A short description of your website"
              />
            </div>
            <div>
              <label htmlFor="default-language" className="block text-sm font-medium text-gray-700 mb-1">
                Default Language
              </label>
              <select
                id="default-language"
                defaultValue={siteData.meta?.language || 'de'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">SEO</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="og-image" className="block text-sm font-medium text-gray-700 mb-1">
                OG Image URL
              </label>
              <input
                id="og-image"
                type="text"
                defaultValue={siteData.seo?.ogImage || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="/media/og-default.jpg"
              />
            </div>
            <div>
              <label htmlFor="ga-id" className="block text-sm font-medium text-gray-700 mb-1">
                Google Analytics ID
              </label>
              <input
                id="ga-id"
                type="text"
                defaultValue={siteData.seo?.googleAnalyticsId || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Publish */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Publish</h2>
          <p className="text-sm text-gray-500 mb-4">
            Save changes to GitHub and trigger a new deployment on Vercel.
          </p>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Save & Publish
          </button>
        </div>
      </div>
    </div>
  )
}
