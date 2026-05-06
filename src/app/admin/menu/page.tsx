import Link from 'next/link'
import fs from 'fs/promises'
import path from 'path'

export default async function MenuPage() {
  const navPath = path.join(process.cwd(), 'data', 'navigation.json')
  let navData: any = { header: [], footer: [] }

  try {
    const content = await fs.readFile(navPath, 'utf-8')
    navData = JSON.parse(content)
  } catch (error) {
    console.error('Error reading navigation:', error)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Navigation Menu</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your website navigation links
        </p>
      </div>

      {/* Header Navigation */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Header Navigation</h2>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            + Add Link
          </button>
        </div>

        {navData.header.length === 0 ? (
          <p className="text-sm text-gray-500">No navigation links yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {navData.header.map((item: any) => (
              <li key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.label?.de || item.label?.en || item.id}
                  </p>
                  <p className="text-xs text-gray-500">{item.url}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${item.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.visible ? 'Visible' : 'Hidden'}
                  </span>
                  <button type="button" className="text-xs text-gray-400 hover:text-gray-600">Edit</button>
                  <button type="button" className="text-xs text-red-400 hover:text-red-600">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Footer Navigation</h2>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            + Add Link
          </button>
        </div>

        {navData.footer.length === 0 ? (
          <p className="text-sm text-gray-500">No footer links yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {navData.footer.map((item: any) => (
              <li key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.label?.de || item.label?.en || item.id}
                  </p>
                  <p className="text-xs text-gray-500">{item.url}</p>
                </div>
                <div className="flex space-x-2">
                  <button type="button" className="text-xs text-gray-400 hover:text-gray-600">Edit</button>
                  <button type="button" className="text-xs text-red-400 hover:text-red-600">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
