import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales } from './src/lib/i18n/utils';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'de',
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаем API маршруты без обработки
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Защита админ-панели — исключаем /admin/login чтобы не было бесконечного редиректа
  if (pathname.startsWith('/admin')) {
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;
    const expectedHash = process.env.ADMIN_TOKEN_HASH;

    if (!token || token !== expectedHash) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  // Интернационализация только для публичных маршрутов (не /admin)
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Исключаем статику, изображения, favicon
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)' 
  ]
};
