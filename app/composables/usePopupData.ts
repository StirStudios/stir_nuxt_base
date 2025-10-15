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
        enabled: false,
        delay: 0,
        showOnce: false,
        trigger: 'delay',
        scrollThreshold: 0.25,
      }
    }

    return {
      enabled: popup.value.enabled ?? true,
      delay: popup.value.delay ?? 3000,
      showOnce: popup.value.showOnce ?? true,
      trigger: popup.value.trigger ?? 'delay',
      scrollThreshold: popup.value.scrollThreshold ?? 0.25,
    }
  })

  return { popup, config }
}
