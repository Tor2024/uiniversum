import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Octokit } from '@octokit/rest';

async function getOctokit() {
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

export async function POST(request: NextRequest) {
  try {
    const { path, content, message } = await request.json();

    if (!path || !content || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const octokit = await getOctokit();
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!owner || !repo) {
      return NextResponse.json({ error: 'GitHub configuration missing' }, { status: 500 });
    }

    let sha: string | undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch
      });
      if ('sha' in data) {
        sha = data.sha;
      }
    } catch (error) {
      // File does not exist, SHA not needed
    }

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch
    });

    return NextResponse.json({ success: true, message: 'File published successfully' });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 });
  }
}