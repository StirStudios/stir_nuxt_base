export const usePopupData = () => {
  const { page } = usePageContext()
  const popup = ref<PopupNode | null>(null)

  function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
  }

  function walk(node: unknown) {
    if (!isRecord(node)) return

    if (node.element === 'paragraph-popup') {
      popup.value = node as PopupNode
      return
    }

    if (node.slots && isRecord(node.slots)) {
      Object.values(node.slots).forEach((slot) => {
        if (Array.isArray(slot)) {
          slot.forEach(walk)
        } else {
          walk(slot)
        }
      })
    }
  }

  watchEffect(() => {
    popup.value = null

    const content = page.value?.content
    if (content) {
      if (Array.isArray(content)) {
        content.forEach(walk)
      } else {
        walk(content)
      }
    }

    const decoupled = page.value?.blocks?.decoupled
    if (!isRecord(decoupled)) return

    Object.values(decoupled).forEach((block) => {
      if (!isRecord(block)) return
      const paragraphBlocks = (block.slots as Record<string, unknown>)
        ?.paragraphBlock
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

type PopupNode = {
  element?: string
  props?: Record<string, unknown>
  slots?: Record<string, unknown>
}
