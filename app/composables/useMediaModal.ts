import type { VNode } from 'vue'
import type { useSlotsToolkit } from '~/composables/useSlotsToolkit'

export function useMediaModal(
  slotMedia: Ref<VNode[]>,
  tk: ReturnType<typeof useSlotsToolkit>,
) {
  type ModalMediaItem = {
    type: string
    key: string
    title?: string
    alt?: string
    credit?: string
    mid?: string
    src?: string
    [key: string]: unknown
  }

  const open = ref(false)
  const activeIndex = ref(0)
  const startIndex = ref(0)
  const itemsOrdered = computed<ModalMediaItem[]>(() =>
    slotMedia.value.map((vnode, i) => {
      const props = tk.propsOf(vnode) as Record<string, unknown>
      const type = typeof props.type === 'string' ? props.type : 'image'
      const mid = typeof props.mid === 'string' ? props.mid : undefined
      const src = typeof props.src === 'string' ? props.src : undefined
      return {
        ...props,
        key: mid ?? src ?? `${type}-${i}`,
        type,
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
