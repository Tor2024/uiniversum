import fs from 'fs/promises'
import path from 'path'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  let siteTitle = 'Мой сайт'
  let blocksCount = 0
  let preset = 'warm_minimalism'

  try {
    const siteData = JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'data', 'site.json'), 'utf-8')
    )
    siteTitle = siteData.meta?.title || 'Мой сайт'
    preset = siteData.design?.preset || 'warm_minimalism'
  } catch {}

  try {
    const homeData = JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'data', 'pages', 'home.json'), 'utf-8')
    )
    blocksCount = homeData.blocks?.length || 0
  } catch {}

  // Check if this looks like a first-time setup (default preset or no blocks)
  const isFirstTime = blocksCount === 0 || preset === 'warm_minimalism'

  return (
    <DashboardClient
      siteTitle={siteTitle}
      blocksCount={blocksCount}
      preset={preset}
      isFirstTime={isFirstTime}
    />
  )
}
