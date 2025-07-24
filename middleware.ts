import { NextRequest, NextResponse } from 'next/server';
import { addSecurityHeaders, enforceHTTPS } from './utils/securityHeaders';

// Enhanced security middleware
export function middleware(request: NextRequest) {
  // Check for HTTPS enforcement first
  const httpsRedirect = enforceHTTPS(request);
  if (httpsRedirect) {
    return httpsRedirect;
  }
  
  const response = NextResponse.next();

  // Add comprehensive security headers
  addSecurityHeaders(response);
  
  // Add request tracking headers
  response.headers.set('X-Request-ID', Date.now().toString());
  
  // Basic rate limiting tracking
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const userAgent = request.headers.get('user-agent') || '';
  
  // Log suspicious requests (development only)
  if (process.env.NODE_ENV === 'development') {
    const suspiciousPatterns = [
      '/admin',
      '/wp-admin',
      '/.env',
      '/config',
      'SELECT * FROM',
      '<script>'
    ];
    
    const url = request.nextUrl.pathname;
    if (suspiciousPatterns.some(pattern => url.includes(pattern))) {
      console.warn(`Suspicious request detected: ${url} from ${ip}`);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};