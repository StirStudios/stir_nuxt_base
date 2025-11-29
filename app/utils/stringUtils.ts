/**
 * Converts a string with underscores to PascalCase.
 * Example: "vendor_offsite_ceremony" => "vendorOffsiteCeremony"
 */
export function toPascalCase(str: string): string {
  return str.replace(/_./g, (match) => match.charAt(1).toUpperCase())
}

/**
 * Converts a string to snake_case.
 * Example: "VendorOffsiteCeremony" => "vendor_offsite_ceremony"
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .replace(/^_/, '')
}

/**
 * Extract the field name from the selector.
 * Example: ':input[name="vendorElc[upTo_65]"]' → 'vendorElc.upTo_65'
 */
export const extractFieldName = (selector: string): string | null => {
  const match = selector.match(/name="(.+?)"/)
  if (!match || !match[1]) {
    return null
  }
  return match[1].replace(/\[([^\]]+)\]/g, '.$1')
}

/**
 * Normalize the string to handle casing and underscores consistently.
 */
export const normalizeValue = (value: string): string => {
  return value.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * Truncates a string to a specified length, appending an ellipsis if it exceeds that length.
 * Example: truncate('Hello World', 5) => "Hello…"
 */
export function truncate(text: string, length = 120): string {
  if (!text) return ''
  return text.length > length ? text.slice(0, length).trimEnd() + '…' : text
}

/**
 * Converts a string into a URL-safe slug.
 * Example: "About Us!" => "about-us"
 */
export function slugify(str: string): string {
  if (!str) return ''

  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // spaces → dash
    .replace(/[^a-z0-9-]/g, '') // strip non-alphanumeric
    .replace(/--+/g, '-') // collapse multiple dashes
}
