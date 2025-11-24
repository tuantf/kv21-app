/**
 * API Client Utility
 *
 * Provides helper functions for making authenticated API requests from the client
 */

/**
 * Get the client sync token from environment variable
 * This must be prefixed with NEXT_PUBLIC_ to be accessible in the browser
 */
function getClientSyncToken(): string {
  const token = process.env.NEXT_PUBLIC_CLIENT_SYNC_TOKEN
  if (!token) {
    throw new Error('NEXT_PUBLIC_CLIENT_SYNC_TOKEN is not set')
  }
  return token
}

/**
 * Create fetch options with authentication headers
 * @param options Optional fetch options to merge
 * @returns Fetch options with Authorization header
 */
export function getAuthenticatedFetchOptions(options?: RequestInit): RequestInit {
  return {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${getClientSyncToken()}`,
      'Content-Type': 'application/json',
    },
  }
}

/**
 * Authenticated fetch wrapper
 * @param url The URL to fetch
 * @param options Optional fetch options
 * @returns Promise<Response>
 */
export async function authenticatedFetch(url: string, options?: RequestInit): Promise<Response> {
  return fetch(url, getAuthenticatedFetchOptions(options))
}
