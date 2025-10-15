export const usePopupData = () => {
  const { page } = usePageContext()

  const popup = computed(() => {
    const decoupledBlocks = page.value?.blocks?.decoupled ?? {}
    const allParagraphs = Object.values(decoupledBlocks)
      .flatMap((block) => block?.paragraphBlock ?? [])
      .flatMap((p) => Object.values(p?.regions || {}).flat())

    return allParagraphs.find((el) => el?.element === 'paragraph-popup') || null
  })

  const config = computed(() => {
    if (!popup.value) {
      return {
        delay: 0,
        showOnce: false,
        trigger: 'delay',
        scrollThreshold: 0.25,
      }
    }

    return {
      delay: popup.value.delay ?? 100,
      showOnce: popup.value.showOnce ?? false,
      trigger: popup.value.trigger ?? 'delay',
      scrollThreshold: popup.value.scrollThreshold ?? 0.25,
    }
  })

  return { popup, config }
}
