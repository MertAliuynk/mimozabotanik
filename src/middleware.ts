import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, allow all requests
  // You can add authentication logic here later
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
  ],
};