import fs from 'fs/promises'
import path from 'path'

export default async function FormsPage() {
  const formsPath = path.join(process.cwd(), 'data', 'forms', 'submissions.json')
  let submissions: any[] = []

  try {
    const content = await fs.readFile(formsPath, 'utf-8')
    submissions = JSON.parse(content)
  } catch (error) {
    console.error('Error reading submissions:', error)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Form Submissions</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage contact form submissions
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No submissions yet.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {submissions.map((sub) => (
              <li key={sub.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-indigo-600 truncate">
                    {sub.name}
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sub.status === 'new' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Email: {sub.email}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-700">{sub.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}