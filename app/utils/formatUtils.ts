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

/**
 * Converts a UNIX timestamp to a readable date string.
 * @param unix - The UNIX timestamp (in seconds).
 * @param locale - Optional locale (default: 'en-US').
 * @param options - Optional Intl.DateTimeFormat options.
 * @returns A formatted date string.
 */
export function formatUnixDate(
  unix: number | string,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  const date = new Date(Number(unix) * 1000)
  return date.toLocaleDateString(locale, options)
}

/**
 * Formats an ISO date/time string in a specific timezone.
 * Intended for UI display (events, schedules, popups).
 */
export function formatZonedDateTime(
  value: string | Date,
  timeZone = 'America/Los_Angeles',
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  },
): string {
  const date = typeof value === 'string' ? new Date(value) : value

  return new Intl.DateTimeFormat(locale, {
    timeZone,
    ...options,
  }).format(date)
}
