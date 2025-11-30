/**
 * Removes HTML tags from a string using regex
 * Safe for use in Cloudflare Workers and all JavaScript environments
 */
function stripHtmlTags(input: string): string {
  // Remove HTML tags while preserving the text content
  // This regex handles both simple tags and self-closing tags
  return input.replace(/<[^>]*>/g, '')
}

/**
 * Sanitizes user input by removing dangerous characters and trimming whitespace
 * Uses regex-based tag stripping for compatibility with Cloudflare Workers
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  const trimmed = input.trim()

  // Strip HTML tags
  const withoutTags = stripHtmlTags(trimmed)

  // Decode common HTML entities
  return withoutTags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
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

  // Strip HTML tags
  return stripHtmlTags(trimmed)
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

  // Extract URL from iframe src attribute
  const iframeMatch = input.match(/<iframe[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/i)
  if (iframeMatch && iframeMatch[1]) {
    return sanitizeUrl(iframeMatch[1])
  }

  // If no iframe tag found, return the original input sanitized
  return sanitizeUrl(input)
}
