/**
 * Generates a timezone offset string in the format "+hhmm" or "-hhmm".
 * @returns The formatted timezone offset.
 */
export function getOffsetString(): string {
  const offsetMinutes = new Date().getTimezoneOffset() * -1
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMinutes)
  const hours = String(Math.floor(abs / 60)).padStart(2, '0')
  const minutes = String(abs % 60).padStart(2, '0')
  return `${sign}${hours}${minutes}`
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
