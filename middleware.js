import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  
  // Define paths that should be protected
  const protectedPaths = ['/profile', '/checkout', '/orders'];
  const isPathProtected = protectedPaths.some((protectedPath) => 
    path.startsWith(protectedPath)
  );
  
  if (isPathProtected) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // Redirect to login if no token
    if (!token) {
      const url = new URL('/auth/signin', req.url);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/checkout/:path*', '/orders/:path*'],
};