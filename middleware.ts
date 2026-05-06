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

  // Защита админ-панели (исключаем /admin/login чтобы избежать бесконечного редиректа)
  if (pathname.includes('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value;
    const expectedHash = process.env.ADMIN_TOKEN_HASH;

    // Если нет токена или он не совпадает, редирект на логин
    if (!token || token !== expectedHash) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Применяем интернационализацию для остальных маршрутов
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};