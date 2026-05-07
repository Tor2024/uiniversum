import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for preview data (per session token)
// This is fine for preview purposes - data is temporary
const previewStore = new Map<string, { data: unknown; expires: number }>();

// Clean up expired entries every 100 requests
let requestCount = 0;

export async function POST(request: NextRequest) {
  const { token, data } = await request.json();

  if (!token || !data) {
    return NextResponse.json({ error: 'Missing token or data' }, { status: 400 });
  }

  // Store for 10 minutes
  previewStore.set(token, { data, expires: Date.now() + 10 * 60 * 1000 });

  // Cleanup old entries periodically
  requestCount++;
  if (requestCount % 100 === 0) {
    const now = Date.now();
    for (const [key, value] of previewStore.entries()) {
      if (value.expires < now) previewStore.delete(key);
    }
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const entry = previewStore.get(token);
  if (!entry || entry.expires < Date.now()) {
    return NextResponse.json({ error: 'Preview expired or not found' }, { status: 404 });
  }

  return NextResponse.json({ data: entry.data });
}
