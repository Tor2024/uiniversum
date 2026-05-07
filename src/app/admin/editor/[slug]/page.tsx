import fs from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'
import EditorClient from './EditorClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function EditorPage({ params }: Props) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), 'data', 'pages', `${slug}.json`)

  let pageData: any = null
  try {
    pageData = JSON.parse(await fs.readFile(filePath, 'utf-8'))
  } catch {
    notFound()
  }

  return <EditorClient slug={slug} initialData={pageData} />
}
