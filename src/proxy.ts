import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const isAuth = !!token;

  // Root path - redirect to dashboard if authenticated, login if not
  if (pathname === '/') {
    if (isAuth) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Auth pages - redirect to dashboard if already authenticated
  if (isAuth && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protected routes
  if (!isAuth && !pathname.startsWith('/login') && !pathname.startsWith('/register')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
