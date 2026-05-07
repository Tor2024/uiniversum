import fs from 'fs/promises'
import path from 'path'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const sitePath = path.join(process.cwd(), 'data', 'site.json')
  let siteData: any = {}
  try {
    siteData = JSON.parse(await fs.readFile(sitePath, 'utf-8'))
  } catch {}
  return <SettingsClient initialData={siteData} />
}
