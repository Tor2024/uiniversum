import siteData from '../../../../data/site.json'
import { DesignTokens } from '@/lib/design-tokens'

type ColorKey = 'colorBackground' | 'colorSurface' | 'colorPrimary' | 'colorAccent' | 'colorSecondary' | 'colorBorder'

const colorKeys: { name: string; key: ColorKey }[] = [
  { name: 'Background', key: 'colorBackground' },
  { name: 'Surface', key: 'colorSurface' },
  { name: 'Primary Text', key: 'colorPrimary' },
  { name: 'Secondary Text', key: 'colorSecondary' },
  { name: 'Border', key: 'colorBorder' },
  { name: 'Accent', key: 'colorAccent' }
]

export default async function DesignPage() {
  const tokens = siteData.design.tokens as DesignTokens

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Design Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Customize your website appearance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Presets */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Presets</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['warm_minimalism', 'glassmorphism', 'neubrutalism', 'bento_ui'].map((preset) => (
              <div 
                key={preset}
                className={`p-4 border rounded-md cursor-pointer hover:border-indigo-500 ${siteData.design.preset === preset ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
              >
                <p className="text-sm font-medium text-center">{preset.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Colors</h2>
          <div className="space-y-4">
            {colorKeys.map((color) => (
              <div key={color.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{color.name}</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: tokens[color.key] }}
                  />
                  <span className="text-xs text-gray-500">{tokens[color.key]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}