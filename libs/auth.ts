/**
 * Authentication Helper Module
 * 
 * Provides reusable functions for Bearer token authentication
 */

import { NextResponse } from 'next/server'

/**
 * Get required environment variable or throw error
 */
function getRequiredEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

/**
 * Get a safe error message for client responses
 * In production, returns generic error messages to avoid leaking internal details
 */
export function getSafeErrorMessage(error: any, defaultMessage: string = 'An error occurred'): string {
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    // Log detailed error server-side
    console.error('Error details:', error)
    return defaultMessage
  }
  
  // In development, return detailed error messages
  return error?.message || defaultMessage
}

/**
 * Verify Bearer token from request headers
 * @param req Request object
 * @param tokenType Type of token to verify ('CLIENT' for CLIENT_SYNC_TOKEN, 'SYNC' for SYNC_TOKEN)
 * @returns Object with success status and error response if failed
 */
export function verifyBearerToken(
  req: Request,
  tokenType: 'CLIENT' | 'SYNC' = 'CLIENT'
): { success: true } | { success: false; response: NextResponse } {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''
  
  if (!token) {
    return {
      success: false,
      response: NextResponse.json({ error: 'Unauthorized: Missing Bearer token' }, { status: 401 }),
    }
  }
  
  const expectedToken =
    tokenType === 'CLIENT' ? getRequiredEnv('CLIENT_SYNC_TOKEN') : getRequiredEnv('SYNC_TOKEN')
  
  if (token !== expectedToken) {
    return {
      success: false,
      response: NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 }),
    }
  }
  
  return { success: true }
}

/**
 * Extract Bearer token from request headers (for logging/debugging purposes)
 * @param req Request object
 * @returns Token string or null
 */
export function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization') || ''
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length)
  }
  return null
}


