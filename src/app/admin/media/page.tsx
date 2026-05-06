import Link from 'next/link'
import fs from 'fs/promises'
import path from 'path'

export default async function MediaPage() {
  const mediaDir = path.join(process.cwd(), 'public', 'media')
  const mediaJsonPath = path.join(process.cwd(), 'data', 'media.json')
  
  let mediaFiles: any[] = []
  
  try {
    if (await fs.access(mediaDir).then(() => true).catch(() => false)) {
      const files = await fs.readdir(mediaDir)
      mediaFiles = files.map(file => ({
        filename: file,
        path: `/media/${file}`,
        // В реальном проекте здесь должны быть метаданные из media.json
      }))
    }
  } catch (error) {
    console.error('Error reading media:', error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your images and files
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Upload Files
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {mediaFiles.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500">
              No files uploaded yet. Click "Upload Files" to add media.
            </li>
          ) : (
            mediaFiles.map((file) => (
              <li key={file.filename} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                      📎
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{file.filename}</p>
                      <p className="text-sm text-gray-500">{file.path}</p>
                    </div>
                  </div>
                  <div>
                    <button className="text-sm text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}