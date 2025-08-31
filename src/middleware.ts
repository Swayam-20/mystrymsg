import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const url = request.nextUrl.clone()
  
  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && token.isVerified && (
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up")
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If user is not authenticated and trying to access protected routes, redirect to home
  if (!token && (
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/about")
  )) {
    return NextResponse.redirect(new URL('/home', request.url))
  }
  
  // Allow access to auth pages and home page for unauthenticated users
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/sign-in/:path*',
    '/sign-up/:path*', 
    '/dashboard/:path*',
    '/about/:path*',
    '/home/:path*'
  ],
}