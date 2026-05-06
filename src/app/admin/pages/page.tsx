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
        const filePath = path.join(pagesDir, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const pageData = JSON.parse(content)
        pages.push(pageData)
      }
    }
  } catch (error) {
    console.error('Error reading pages:', error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your website pages
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Page
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {pages.map((page) => (
            <li key={page.slug}>
              <Link
                href={`/admin/editor/${page.slug}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-indigo-600 truncate">
                      {page.title.en} / {page.title.de} / {page.title.ru}
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        page.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Slug: {page.slug}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Blocks: {page.blocks?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}