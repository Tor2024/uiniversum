import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Octokit } from '@octokit/rest'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf']

async function saveMediaMetadataToGitHub(newFile: object) {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'

  if (!token || !owner || !repo) return

  const octokit = new Octokit({ auth: token })
  const filePath = 'data/media.json'

  let currentMedia: object[] = []
  let sha: string | undefined

  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: filePath, ref: branch })
    if ('content' in data && 'sha' in data) {
      sha = data.sha
      currentMedia = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'))
    }
  } catch {
    // Файл не существует
  }

  currentMedia.push(newFile)

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: 'Upload media file',
    content: Buffer.from(JSON.stringify(currentMedia, null, 2)).toString('base64'),
    sha,
    branch
  })
}

async function uploadFileToGitHub(filename: string, buffer: Buffer): Promise<string> {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'

  if (!token || !owner || !repo) {
    throw new Error('GitHub configuration missing')
  }

  const octokit = new Octokit({ auth: token })
  const filePath = `public/media/${filename}`

  // Проверяем, существует ли файл (для получения SHA)
  let sha: string | undefined
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: filePath, ref: branch })
    if ('sha' in data) sha = data.sha
  } catch {
    // Файл не существует — это нормально
  }

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Upload media: ${filename}`,
    content: buffer.toString('base64'),
    sha,
    branch
  })

  return `/media/${filename}`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Безопасное имя файла
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filename = `${timestamp}_${safeName}`

    // Загружаем файл в GitHub (работает и локально, и на Vercel)
    const publicPath = await uploadFileToGitHub(filename, buffer)

    const newFile = {
      id: `media_${timestamp}`,
      filename,
      originalName: file.name,
      path: publicPath,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      alt: { de: '', en: '', ru: '' },
      caption: { de: '', en: '', ru: '' }
    }

    // Сохраняем метаданные в data/media.json
    await saveMediaMetadataToGitHub(newFile)

    return NextResponse.json({ success: true, file: newFile })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
