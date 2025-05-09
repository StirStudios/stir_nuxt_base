/**
 * Formats a number as currency.
 * @param value - The number to format.
 * @param currency - The currency code (default is USD).
 * @param locale - The locale for formatting (default is en-US).
 * @returns The formatted currency string.
 */
export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}
