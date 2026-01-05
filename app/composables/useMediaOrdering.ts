export function useMediaOrdering(
  slotMedia: Ref<any[]>,
  props: { randomize?: boolean },
  tk: ReturnType<typeof useSlotsToolkit>,
) {
  // Base DOM order
  const baseIndices = computed(() => slotMedia.value.map((_, i) => i))

  // Fisher–Yates shuffle
  function computeRandomOrder() {
    const arr = [...baseIndices.value]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const orderedIndices = tk.hydrateOrder(
    () => baseIndices.value,
    () => {
      if (props.randomize) return computeRandomOrder()
      return baseIndices.value
    },
  )

  return {
    baseIndices,
    orderedIndices,
  }
}
