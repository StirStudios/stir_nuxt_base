import type { SectionProps } from '~/types'

/**
 * Fisher-Yates shuffle for randomizing layout order
 */
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Returns a client-only shuffled version of layouts,
 * preserving order unless `randomize` is true.
 */
export function useShuffledLayouts(layouts: SectionProps[] = []) {
  const shuffledLayouts = ref<SectionProps[]>(layouts)

  onMounted(() => {
    const randomized = shuffleArray(layouts.filter((l) => l.randomize))
    let i = 0
    shuffledLayouts.value = layouts.map((layout) =>
      layout.randomize ? randomized[i++] : layout,
    )
  })

  return shuffledLayouts
}
