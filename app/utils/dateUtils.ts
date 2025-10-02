/**
 * Generates a timezone offset string (e.g. "-0700", "+0100") for a given IANA timezone.
 * Defaults to the current date/time if no date is provided.
 */
export function getOffsetString(
  timeZone: string,
  date: Date = new Date(),
): string {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
  })

  const parts = dtf.formatToParts(date)
  const offset = parts.find((p) => p.type === 'timeZoneName')?.value || 'GMT+0'

  // Example offsets: "GMT-7", "GMT+05:30"
  const match = offset.match(/GMT([+-]?\d+)(?::(\d+))?/)
  if (match && match[1] !== undefined) {
    const rawHours = match[1] // includes sign
    const sign = rawHours.startsWith('-') ? '-' : '+'
    const hours = String(Math.abs(Number(rawHours))).padStart(2, '0')
    const minutes = String(match[2] || '0').padStart(2, '0')
    return `${sign}${hours}${minutes}`
  }

  // Fallback: no match, return UTC
  return '+0000'
}

/**
 * Generates time options for a given range and step interval.
 * @param min - Start time (HH:mm)
 * @param max - End time (HH:mm)
 * @param step - Interval in seconds
 * @returns Array of objects with value and label
 */
export function generateTimeOptions(min: string, max: string, step: number) {
  const times = []
  const [minH, minM] = min.split(':').map(Number)
  const [maxH, maxM] = max.split(':').map(Number)

  // Apply fallback in case of undefined
  const current = new Date()
  current.setHours(minH ?? 0, minM ?? 0, 0, 0)

  const end = new Date()
  end.setHours(maxH ?? 0, maxM ?? 0, 0, 0)

  while (current <= end) {
    const h = current.getHours().toString().padStart(2, '0')
    const m = current.getMinutes().toString().padStart(2, '0')
    const value = `${h}:${m}`
    const hour12 = current.getHours() % 12 || 12
    const suffix = current.getHours() >= 12 ? 'PM' : 'AM'
    const label = `${hour12}:${m} ${suffix}`
    times.push({ value, label })
    current.setSeconds(current.getSeconds() + step)
  }

  return times
}
