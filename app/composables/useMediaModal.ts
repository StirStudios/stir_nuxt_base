export function useMediaModal(slotMedia: Ref<unknown[]>, tk: any) {
  const open = ref(false)
  const activeIndex = ref(0)
  const startIndex = ref(0)

  const itemsOrdered = computed(() =>
    slotMedia.value.map((vnode, i) => {
      const props = tk.propsOf(vnode)
      return {
        ...props,
        key: props.mid ?? props.src ?? `${props.type}-${i}`,
        type: props.type,
      }
    }),
  )

  const activeItem = computed(
    () => itemsOrdered.value[activeIndex.value] ?? null,
  )

  const modalTitle = computed(() => activeItem.value?.title || '')
  const modalDescription = computed(
    () => activeItem.value?.alt || activeItem.value?.credit || '',
  )
  const modalCredit = computed(() => activeItem.value?.credit || '')

  function openModal(index: number) {
    startIndex.value = index
    activeIndex.value = index
    open.value = true
  }

  function onSelect(index: number) {
    activeIndex.value = index
  }

  return {
    open,
    startIndex,
    itemsOrdered,
    activeItem,
    modalTitle,
    modalDescription,
    modalCredit,
    openModal,
    onSelect,
  }
}
