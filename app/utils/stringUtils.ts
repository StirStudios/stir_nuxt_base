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
