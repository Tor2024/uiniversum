import fs from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'
import PresetEditClient from './PresetEditClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PresetEditPage({ params }: Props) {
  const { id } = await params
  const filePath = path.join(process.cwd(), 'data', 'presets', `${id}.json`)

  let preset: any = null
  try {
    preset = JSON.parse(await fs.readFile(filePath, 'utf-8'))
  } catch {
    notFound()
  }

  return <PresetEditClient presetId={id} initialData={preset} />
}
