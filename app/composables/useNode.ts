// composables/useNode.ts
import { computed } from 'vue'
import type { VNode } from 'vue'
import { useSlotsToolkit } from './useSlotsToolkit'

/**
 * UNIVERSAL NODE SLOT PARSER
 * Extracts section, hero, or any paragraph-style slot.
 */
export function useNode(slots: unknown) {
  const tk = useSlotsToolkit(slots)

  /**
   * Extract a paragraph from a named slot:
   * - vnode
   * - props
   * - text
   * - media (nested slot)
   */
  const useParagraph = (slotName: string) => {
    const vnode = computed<VNode | undefined>(() => {
      return tk.slot(slotName)[0] ?? undefined
    })

    const props = computed(() => tk.propsOf(vnode.value) ?? {})

    const mediaProps = computed(() => {
      const node = vnode.value
      if (!node) return {}

      // Slots dictionary: { media(): VNode[] }
      type SlotDict = Record<string, (() => VNode[]) | undefined>
      const children = node.children as unknown as SlotDict

      const mediaFn = children.media
      if (!mediaFn) return {}

      const mediaVNode = mediaFn()?.[0]
      return tk.propsOf(mediaVNode) ?? {}
    })

    const text = computed(() => props.value.text || '')

    return {
      get vnode() {
        return vnode.value
      },
      get props() {
        return props.value
      },
      get media() {
        return mediaProps.value
      },
      get text() {
        return text.value
      },
    }
  }

  return {
    // Default slots nodes typically have
    section: useParagraph('section'),
    hero: useParagraph('hero'),

    // Extensible for custom cases:
    paragraph(slotName: string) {
      return useParagraph(slotName)
    },
  }
}

/**
 * TEASER EXTRACTION
 * just returns `.section` from a node.
 */
export function useNodeTeaser(slots: unknown) {
  const node = useNode(slots)
  return node.section
}
