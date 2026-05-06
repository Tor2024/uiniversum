import { notFound } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'

export default async function EditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pagesDir = path.join(process.cwd(), 'data', 'pages')
  const filePath = path.join(pagesDir, `${slug}.json`)

  let pageData: any = null

  try {
    const content = await fs.readFile(filePath, 'utf-8')
    pageData = JSON.parse(content)
  } catch (error) {
    notFound()
  }

  if (!pageData) {
    notFound()
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Block Library */}
      <aside className="w-70 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Blocks</h2>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <p className="text-sm font-medium">Hero</p>
              <p className="text-xs text-gray-500">Large banner with title</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <p className="text-sm font-medium">Rich Text</p>
              <p className="text-xs text-gray-500">Text editor</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <p className="text-sm font-medium">Image</p>
              <p className="text-xs text-gray-500">Single image</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Center - Canvas */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold mb-4">{pageData.title.en}</h1>
          
          {pageData.blocks?.map((block: any) => (
            <div key={block.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium text-gray-500 uppercase">{block.type}</span>
                <div className="flex space-x-2">
                  <button className="text-xs text-gray-400 hover:text-gray-600">Edit</button>
                  <button className="text-xs text-red-400 hover:text-red-600">Delete</button>
                </div>
              </div>
              <p className="text-sm text-gray-600">Block ID: {block.id}</p>
              <p className="text-xs text-gray-400 mt-2">Language content preview...</p>
            </div>
          ))}

          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-400">
            + Add Block
          </button>
        </div>
      </main>

      {/* Right Panel - Settings */}
      <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="padding-top">
                Padding Top
              </label>
              <input 
                id="padding-top"
                type="number" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue="40"
                title="Padding top value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bg-color">
                Background Color
              </label>
              <input 
                id="bg-color"
                type="color" 
                className="w-full h-10 border border-gray-300 rounded-md"
                defaultValue="#FFFFFF"
                title="Background color picker"
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}