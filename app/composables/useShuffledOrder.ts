/**
 * Returns a shuffled reactive copy of the input array (if `shouldShuffle` is true),
 * otherwise returns the array as-is.
 */
export function useShuffledOrder<T>(
  rows: T[],
  shouldShuffle = false,
): Ref<T[]> {
  const output = ref<T[]>([])

  watchEffect(() => {
    if (shouldShuffle && rows.length) {
      const copy = [...rows]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      output.value = copy
    } else {
      output.value = rows
    }
  })

  return output
}
