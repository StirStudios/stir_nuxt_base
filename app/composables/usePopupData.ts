export const usePopupData = () => {
  const { page } = usePageContext()
  const popup = ref<any>(null)

  function walk(node: any) {
    if (!node || typeof node !== 'object') return

    if (node.element === 'paragraph-popup') {
      popup.value = node
      return
    }

    if (node.slots) {
      Object.values(node.slots).forEach((slot) => {
        Array.isArray(slot) ? slot.forEach(walk) : walk(slot)
      })
    }
  }

  watchEffect(() => {
    popup.value = null

    const content = page.value?.content
    if (content) {
      Array.isArray(content) ? content.forEach(walk) : walk(content)
    }

    const decoupled = page.value?.blocks?.decoupled
    if (!decoupled || typeof decoupled !== 'object') return

    Object.values(decoupled).forEach((block: any) => {
      const paragraphBlocks = block?.slots?.paragraphBlock
      if (!Array.isArray(paragraphBlocks)) return

      paragraphBlocks.forEach(walk)
    })
  })

  const config = computed(() => {
    const p = popup.value?.props ?? {}

    return {
      trigger:
        p.popupTrigger === 'delay' ||
        p.popupTrigger === 'scroll' ||
        p.popupTrigger === 'exit'
          ? p.popupTrigger
          : 'delay',
      delay: typeof p.popupDelay === 'number' ? p.popupDelay : 100,
      showOnce: p.popupOnce === true,
      scrollThreshold:
        typeof p.popupScrollThreshold === 'number'
          ? p.popupScrollThreshold
          : 0.25,
    }
  })

  return { popup, config }
}
