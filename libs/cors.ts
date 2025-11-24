/**
 * CORS Configuration Module
 * 
 * Manages allowed origins for CORS requests.
 * Same-origin is always allowed. Additional origins can be configured
 * via ALLOWED_ORIGINS environment variable (comma-separated).
 */

/**
 * Get the list of allowed origins for CORS
 * @returns Array of allowed origin strings
 */
export function getAllowedOrigins(): string[] {
  const origins: string[] = []
  
  // Same-origin is always allowed
  origins.push('same-origin')
  
  // Get additional origins from environment variable
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS
  if (allowedOriginsEnv) {
    const additionalOrigins = allowedOriginsEnv
      .split(',')
      .map(origin => origin.trim())
      .filter(origin => origin.length > 0)
    
    origins.push(...additionalOrigins)
  }
  
  return origins
}

/**
 * Check if an origin is allowed
 * @param origin The origin to check (from request header)
 * @param requestUrl The URL of the current request
 * @returns true if origin is allowed, false otherwise
 */
export function isOriginAllowed(origin: string | null, requestUrl: string): boolean {
  // No origin header means same-origin request (browser omits it for same-origin)
  if (!origin) {
    return true
  }
  
  const allowedOrigins = getAllowedOrigins()
  
  // Check if origin matches any allowed origin
  if (allowedOrigins.includes(origin)) {
    return true
  }
  
  // Check if it's same-origin by comparing with request URL
  try {
    const requestOrigin = new URL(requestUrl).origin
    if (origin === requestOrigin) {
      return true
    }
  } catch {
    // Invalid URL, continue checking
  }
  
  return false
}

/**
 * Get CORS headers for a response
 * @param origin The origin from the request header
 * @param requestUrl The URL of the current request
 * @returns Object with CORS headers
 */
export function getCorsHeaders(origin: string | null, requestUrl: string): Record<string, string> {
  const allowed = isOriginAllowed(origin, requestUrl)
  
  if (!allowed) {
    return {}
  }
  
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
  
  // If origin is provided and allowed, echo it back
  if (origin && allowed) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Credentials'] = 'true'
  } else {
    // For same-origin requests, use wildcard is not recommended, but we'll allow it
    headers['Access-Control-Allow-Origin'] = '*'
  }
  
  return headers
}


