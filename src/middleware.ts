// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isSuperAdmin = request.cookies.get('isSuperAdmin')?.value === '1';
  const { pathname } = request.nextUrl;

  const isSuperAdminRoute = pathname.startsWith('/super-admin');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isProtectedRoute = isSuperAdminRoute || isDashboardRoute;

  // Auth routes (login, register)
  const authRoutes = ['/login'];
  const isAuthRoute = authRoutes.includes(pathname);

  // No token + protected route → redirect to login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Has token + super admin route but NOT super admin → redirect to dashboard
  if (token && isSuperAdminRoute && !isSuperAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Has token + dashboard route but IS super admin → redirect to super admin
  if (token && isDashboardRoute && isSuperAdmin) {
    return NextResponse.redirect(new URL('/super-admin', request.url));
  }

  // Has token + auth route → redirect based on role
  if (token && isAuthRoute) {
    const redirectUrl = isSuperAdmin ? '/super-admin' : '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/super-admin/:path*', '/login'],
};
