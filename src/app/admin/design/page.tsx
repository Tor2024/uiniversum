import fs from 'fs/promises'
import path from 'path'
import DesignClient from './DesignClient'

export default async function DesignPage() {
  const filePath = path.join(process.cwd(), 'data', 'site.json')
  const siteData = JSON.parse(await fs.readFile(filePath, 'utf-8'))
  return <DesignClient initialData={siteData} />
}
