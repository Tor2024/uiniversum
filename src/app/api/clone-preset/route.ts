import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

// Функция для работы с GitHub
async function getOctokit() {
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

// Чтение файла (локально или из GitHub)
async function readPresetFile(presetId: string): Promise<{ content: any; sha?: string }> {
  const filePath = path.join(process.cwd(), 'data', 'presets', `${presetId}.json`);
  
  try {
    // Сначала пробуем прочитать локально (для разработки)
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return { content: JSON.parse(fileContent) };
    }
  } catch (e) {
    console.error('Error reading local preset:', e);
  }

  // Если локально нет, тянем с GitHub
  try {
    const octokit = await getOctokit();
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    
    const { data } = await octokit.repos.getContent({
      owner: owner!,
      repo: repo!,
      path: `data/presets/${presetId}.json`,
      ref: branch
    });
    
    if ('content' in data && 'sha' in data) {
      const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
      return { content, sha: data.sha };
    }
  } catch (e) {
    console.error('Error reading preset from GitHub:', e);
  }

  throw new Error(`Preset ${presetId} not found`);
}

// Сохранение файла через GitHub
async function saveFileToGitHub(filePath: string, content: any, message: string, sha?: string) {
  const octokit = await getOctokit();
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  
  await octokit.repos.createOrUpdateFileContents({
    owner: owner!,
    repo: repo!,
    path: filePath,
    message,
    content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
    sha,
    branch
  });
}

// Создание домашней страницы из контента пресета
function createHomePageFromPreset(presetContent: any) {
  const blocks = [];
  let order = 0;

  // Hero блок
  if (presetContent.content?.hero) {
    blocks.push({
      id: 'hero-1',
      type: 'hero',
      visible: true,
      order: order++,
      settings: {
        heading: presetContent.content.hero,
        subheading: presetContent.content.hero, // упрощенно
        buttonText: presetContent.content.hero,
        buttonUrl: '#contact',
        backgroundImage: presetContent.content.hero?.en ? '/media/presets/restaurant/hero.jpg' : '',
        backgroundOverlay: 40,
        height: 'large'
      },
      styles: {
        paddingTop: 80,
        paddingBottom: 80,
        backgroundColor: '',
        textAlign: 'center',
        maxWidth: 'xl'
      }
    });
  }

  // Text блок (About)
  if (presetContent.content?.about) {
    blocks.push({
      id: 'text-1',
      type: 'text_rich',
      visible: true,
      order: order++,
      settings: {
        content: presetContent.content.about
      },
      styles: {
        paddingTop: 60,
        paddingBottom: 60,
        backgroundColor: 'var(--color-surface)',
        textAlign: 'left',
        maxWidth: 'md'
      }
    });
  }

  return {
    title: presetContent.meta?.title || 'Home',
    blocks
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const presetId = formData.get('presetId') as string;
    
    if (!presetId) {
      return NextResponse.json({ error: 'Missing presetId' }, { status: 400 });
    }

    // Читаем пресет
    const { content: presetContent } = await readPresetFile(presetId);
    
    // 1. Копируем в site.json (только meta, design, seo, booking, logo)
    const siteData = {
      meta: presetContent.meta,
      design: presetContent.design,
      seo: presetContent.seo,
      booking: presetContent.booking,
      logo: presetContent.logo
    };

    // Получаем SHA текущего site.json если есть
    let siteSha: string | undefined;
    try {
      const octokit = await getOctokit();
      const { data } = await octokit.repos.getContent({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path: 'data/site.json',
        ref: process.env.GITHUB_BRANCH || 'main'
      });
      if ('sha' in data) siteSha = data.sha;
    } catch (e) { /* файл может не существовать */ }

    await saveFileToGitHub('data/site.json', siteData, `Clone preset: ${presetId} -> site.json`, siteSha);

    // 2. Создаем home page из контента пресета
    const homePage = createHomePageFromPreset(presetContent);
    
    let homeSha: string | undefined;
    try {
      const octokit = await getOctokit();
      const { data } = await octokit.repos.getContent({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path: 'data/pages/home.json',
        ref: process.env.GITHUB_BRANCH || 'main'
      });
      if ('sha' in data) homeSha = data.sha;
    } catch (e) { /* файл может не существовать */ }

    await saveFileToGitHub('data/pages/home.json', homePage, `Clone preset: ${presetId} -> home.json`, homeSha);

    // 3. Обновляем navigation.json если нужно (добавляем страницу если нет)
    // ... (упрощенно)

    return NextResponse.json({ 
      success: true, 
      message: `Preset ${presetId} cloned successfully`,
      redirect: '/admin' 
    });
    
  } catch (error: any) {
    console.error('Clone preset error:', error);
    return NextResponse.json({ error: error.message || 'Failed to clone preset' }, { status: 500 });
  }
}