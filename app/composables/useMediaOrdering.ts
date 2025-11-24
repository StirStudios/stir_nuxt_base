import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useMediaOrdering(slotMedia, props, tk) {
  const breakpoints = useBreakpoints(breakpointsTailwind)

  const isMatrixLayout = computed(() => !!props.isMatrix)

  const columnCount = computed(() => {
    if (!isMatrixLayout.value) return 1

    const map: Record<string, number> = {}
    props.gridItems?.split(/\s+/).forEach((cls) => {
      const match = cls.match(/(?:(\w+):)?columns-(\d+)/)
      if (match) map[match[1] || 'base'] = parseInt(match[2])
    })

    const order = ['2xl', 'xl', 'lg', 'md', 'sm']
    for (const bp of order) {
      if (breakpoints.greaterOrEqual(bp).value && map[bp]) return map[bp]
    }

    return map.base || 1
  })

  const baseIndices = computed(() => slotMedia.value.map((_, i) => i))

  function computeMatrixDomOrder() {
    const cols = columnCount.value
    const buckets = Array.from({ length: cols }, () => [])
    baseIndices.value.forEach((idx, i) => buckets[i % cols].push(idx))
    return buckets.flat()
  }

  function computeRandomOrder() {
    const arr = [...baseIndices.value]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const chosenOrderFn = () => {
    if (isMatrixLayout.value) return computeMatrixDomOrder()
    if (props.randomize) return computeRandomOrder()
    return baseIndices.value
  }

  const orderedIndices = tk.hydrateOrder(
    () => baseIndices.value,
    () => chosenOrderFn(),
  )

  return {
    baseIndices,
    orderedIndices,
  }
}
