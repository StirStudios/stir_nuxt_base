// ~/composables/useSlotsToolkit.ts
import type { VNode } from 'vue'
import { isVNode } from 'vue'

/* -------------------------------------------------------
 *  LOW-LEVEL HELPERS
 * ----------------------------------------------------- */

export function useSlotVNode(slots: any, name: string): VNode[] {
  const content = slots?.[name]?.()
  return Array.isArray(content) ? content : []
}

export function getVNodeProps(vnode: VNode | undefined) {
  return vnode && isVNode(vnode) ? (vnode.props ?? {}) : {}
}

/* -------------------------------------------------------
 *  HERO + MEDIA HELPERS
 * ----------------------------------------------------- */

export function extractHeroMedia(slots: any) {
  const heroNodes = useSlotVNode(slots, 'hero')
  if (!heroNodes.length) return null

  const heroVNode = heroNodes[0]
  const nested = heroVNode.children?.media?.()
  return Array.isArray(nested) ? (nested[0] ?? null) : null
}

export function extractMediaItems(slots: any): VNode[] {
  return useSlotVNode(slots, 'media')
}

export function isVNodeMediaEmbed(vnode: VNode | undefined): boolean {
  const props = getVNodeProps(vnode)
  return !!props.mediaEmbed
}

/* -------------------------------------------------------
 *  SHUFFLE
 * ----------------------------------------------------- */

export function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/* -------------------------------------------------------
 *  TOOLKIT EXPORT
 * ----------------------------------------------------- */

export function useSlotsToolkit(slots: any) {
  return {
    slots,

    // basic slot access
    slot(name: string) {
      return useSlotVNode(slots, name)
    },

    // vnode helpers
    propsOf: getVNodeProps,

    // hero/media
    heroMedia() {
      return extractHeroMedia(slots)
    },

    mediaItems() {
      return extractMediaItems(slots)
    },

    // shuffle helpers
    shuffle<T>(items: T[]): T[] {
      return shuffleArray(items)
    },

    // media type detection
    isMediaEmbed(vnode: VNode | undefined) {
      return isVNodeMediaEmbed(vnode)
    },
  }
}
