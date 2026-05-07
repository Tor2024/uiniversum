import fs from 'fs/promises'
import path from 'path'
import MediaClient from './MediaClient'

export default async function MediaPage() {
  const mediaDir = path.join(process.cwd(), 'public', 'media')
  let mediaFiles: any[] = []

  try {
    const exists = await fs.access(mediaDir).then(() => true).catch(() => false)
    if (exists) {
      const files = await fs.readdir(mediaDir)
      mediaFiles = files
        .filter(f => /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i.test(f))
        .map((file, i) => ({
          id: `local_${i}`,
          filename: file,
          originalName: file,
          path: `/media/${file}`,
        }))
    }
  } catch {}

  // Also try to load from data/media.json if it exists
  try {
    const metaPath = path.join(process.cwd(), 'data', 'media.json')
    const meta = JSON.parse(await fs.readFile(metaPath, 'utf-8'))
    if (Array.isArray(meta)) {
      // Merge: prefer metadata entries, deduplicate by path
      const metaPaths = new Set(meta.map((m: any) => m.path))
      const localOnly = mediaFiles.filter(f => !metaPaths.has(f.path))
      mediaFiles = [...meta, ...localOnly]
    }
  } catch {}

  return <MediaClient initialFiles={mediaFiles} />
}
