import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const password = formData.get('password') as string

  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  const adminTokenHash = process.env.ADMIN_TOKEN_HASH

  if (!adminPasswordHash || !adminTokenHash) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const isValid = await verifyPassword(password, adminPasswordHash)

  if (isValid) {
    const response = NextResponse.redirect(new URL('/admin/dashboard', request.url))
    response.cookies.set({
      name: 'admin_token',
      value: adminTokenHash,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })
    return response
  }

  return NextResponse.redirect(new URL('/admin/login?error=1', request.url))
}