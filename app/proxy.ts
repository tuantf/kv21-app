import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/api/:path*',
}

export default async function proxy(request: NextRequest) {
  // 1. Handle CORS
  const origin = request.headers.get('origin')

  // Get allowed origins from environment variable (comma-separated)
  // In production, ALLOWED_ORIGINS must be set. In development, fallback to localhost only
  const allowedOrigins = ['localhost:3000', '10.199.1.16:3000', 'kv21.io.vn']

  // In production, reject requests without origin (except same-origin requests)
  const isProduction = process.env.NODE_ENV === 'production'
  const isSameOrigin = !origin || origin === request.nextUrl.origin

  // Allow same-origin requests, otherwise require origin to be in allowed list
  const isAllowedOrigin = isSameOrigin || (origin ? allowedOrigins.includes(origin) : false)

  // In production, reject requests without origin header (unless same-origin)
  if (isProduction && !origin && !isSameOrigin) {
    return new NextResponse(null, { status: 403 })
  }

  // 2. Handle OPTIONS request (Preflight)
  if (request.method === 'OPTIONS') {
    if (isAllowedOrigin) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin || '',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }
    return new NextResponse(null, { status: 403 })
  }

  // 3. Proceed
  const response = NextResponse.next()

  // Add CORS headers to response
  if (origin && isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return response
}
