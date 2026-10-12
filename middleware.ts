import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, locales } from './lib/i18n';

/** Stuurt paden zonder taal door naar /nl of /en (op basis van Accept-Language). */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const accept = request.headers.get('accept-language') ?? '';
  const locale = /^en\b/i.test(accept) ? 'en' : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|images|icon.png|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
