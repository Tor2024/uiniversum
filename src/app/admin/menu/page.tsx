import fs from 'fs/promises'
import path from 'path'
import MenuClient from './MenuClient'

export default async function MenuPage() {
  const navPath = path.join(process.cwd(), 'data', 'navigation.json')
  let navData = { header: [], footer: [] }
  try {
    navData = JSON.parse(await fs.readFile(navPath, 'utf-8'))
  } catch {}
  return <MenuClient initialData={navData} />
}
