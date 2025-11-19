interface PopupData {
  element?: string
  popupDelay?: number
  popupOnce?: boolean
  popupTrigger?: 'delay' | 'scroll' | 'exit'
  popupThreshold?: number
  [key: string]: unknown
}

interface ParagraphBlockItem {
  element?: string
  regions?: Record<string, PopupData[]>
  [key: string]: unknown
}

interface ParagraphBlockContainer {
  paragraphBlock?: ParagraphBlockItem[]
}

type DecoupledBlocks = Record<string, ParagraphBlockContainer>

export const usePopupData = () => {
  const { page } = usePageContext()

  const popup = ref<any>(null)

  // Walk CE tree looking for element === 'paragraph-popup'
  function walk(node: any) {
    if (!node) return

    if (node.element === 'paragraph-popup') {
      popup.value = node
      return
    }

    if (node.slots) {
      for (const slot of Object.values(node.slots)) {
        if (Array.isArray(slot)) {
          slot.forEach(walk)
        } else {
          walk(slot)
        }
      }
    }
  }

  watchEffect(() => {
    popup.value = null
    walk(page.value?.content)
  })

  const config = computed(() => {
    const p = popup.value?.props || {}

    return {
      delay: typeof p.popupDelay === 'number' ? p.popupDelay : 100,
      showOnce: p.popupOnce === true,
      trigger: ['delay', 'scroll', 'exit'].includes(p.popupTrigger)
        ? p.popupTrigger
        : 'scroll',
      scrollThreshold:
        typeof p.popupThreshold === 'number' &&
        p.popupThreshold >= 0.25 &&
        p.popupThreshold <= 1
          ? p.popupThreshold
          : 0.25,
    }
  })

  return { popup, config }
}
