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

  const popup = computed<PopupData | null>(() => {
    const decoupledBlocks: DecoupledBlocks = page.value?.blocks?.decoupled ?? {}

    const allParagraphs: PopupData[] = Object.values(decoupledBlocks)
      .flatMap((block) => block.paragraphBlock ?? [])
      .flatMap((p) => Object.values(p.regions ?? {}).flat()) as PopupData[]

    return (
      allParagraphs.find(
        (el): el is PopupData =>
          typeof el.element === 'string' && el.element === 'paragraph-popup',
      ) ?? null
    )
  })

  const config = computed(() => {
    const popupData = popup.value ?? {}

    return {
      delay:
        typeof popupData.popupDelay === 'number' ? popupData.popupDelay : 100,
      showOnce: popupData.popupOnce === true,
      trigger:
        typeof popupData.popupTrigger === 'string' &&
        ['delay', 'scroll', 'exit'].includes(popupData.popupTrigger)
          ? popupData.popupTrigger
          : 'scroll',
      scrollThreshold:
        typeof popupData.popupThreshold === 'number' &&
        popupData.popupThreshold >= 0.25 &&
        popupData.popupThreshold <= 1
          ? popupData.popupThreshold
          : 0.25,
    }
  })

  return { popup, config }
}
