/**
 * Sanitizes user input by removing dangerous characters and trimming whitespace
 * Uses isomorphic-dompurify for robust XSS protection on both client and server
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Trim whitespace
  const trimmed = input.trim()

  // Use DOMPurify to sanitize HTML
  // ALLOWED_TAGS: [] means strip ALL HTML tags, leaving only text.
  // This mimics the previous behavior of removing script/iframe/etc but is safer.
  // If you want to allow some basic HTML (like bold/italic), you can remove the config object.
  return DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [] })
}

/**
 * Sanitizes URL input by removing dangerous HTML tags while preserving URL characters
 * @param url - The URL string to sanitize
 * @returns Sanitized URL
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }

  const trimmed = url.trim()

  // For URLs, we also want to strip HTML tags.
  // DOMPurify will keep the text content (the URL itself).
  // It also handles encoding.
  return DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [] })
}

/**
 * Extracts URL from an iframe tag's src attribute
 * If the input is not an iframe tag, returns the original input
 * @param input - The string that may contain an iframe tag
 * @returns Extracted URL or original input if no iframe tag found
 */
export function extractUrlFromIframe(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // We still use regex for extraction as it's efficient for this specific pattern
  // but we sanitize the output to be safe.
  const iframeMatch = input.match(/<iframe[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/i)
  if (iframeMatch && iframeMatch[1]) {
    return sanitizeUrl(iframeMatch[1])
  }

  // If no iframe tag found, return the original input sanitized
  return sanitizeUrl(input)
}
