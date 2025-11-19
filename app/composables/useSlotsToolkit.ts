// ~/composables/useSlotsToolkit.ts
import type { VNode } from 'vue'
import { isVNode, useSlots } from 'vue'

/* -------------------------------------------------------
 *  LOW-LEVEL HELPERS
 * ----------------------------------------------------- */

/** Safely get a slot’s VNode array. */
export function useSlotVNode(slots: any, name: string): VNode[] {
  const content = slots?.[name]?.()
  return Array.isArray(content) ? content : []
}

/** Get props of a VNode (if any) */
export function getVNodeProps(vnode: VNode | undefined) {
  return vnode && isVNode(vnode) ? (vnode.props ?? {}) : {}
}

/** Get children object of a VNode */
export function getVNodeChildren(vnode: VNode | undefined): any {
  return vnode && isVNode(vnode) ? (vnode.children ?? {}) : {}
}

/** Extract a nested slot inside a VNode: vnode.children[name]?.() */
export function extractNestedSlot(
  vnode: VNode | undefined,
  name: string,
): VNode[] {
  if (!vnode || !isVNode(vnode)) return []
  const children = vnode.children as any
  const nested = children?.[name]?.()
  return Array.isArray(nested) ? nested : []
}

/** Clone props from a VNode */
export function cloneVNodeProps(vnode: VNode | undefined) {
  return vnode && isVNode(vnode) ? { ...(vnode.props ?? {}) } : {}
}

/* -------------------------------------------------------
 *  MID-LEVEL CE HELPERS
 * ----------------------------------------------------- */

/** Extract hero media from <slot name="hero"> → <slot name="media"> */
export function extractHeroMedia(slots: any) {
  const heroNodes = useSlotVNode(slots, 'hero')
  if (!heroNodes.length) return null

  const heroVNode = heroNodes[0]
  const mediaNodes = extractNestedSlot(heroVNode, 'media')
  return mediaNodes[0] ?? null
}

/** Extract hero media from a CE node (rows[i]) */
export function extractCeHeroMediaFromNode(node: any) {
  const heroCE = node?.slots?.hero?.[0]
  if (!heroCE) return null

  return heroCE.slots?.media?.()[0] ?? null
}

/** Extract rows from a <drupal-view> */
export function extractCeRows(slots: any) {
  return useSlotVNode(slots, 'rows')
}

/** Check if a vnode is a Bunny mediaEmbed video */
export function isVNodeMediaEmbed(vnode: VNode | undefined): boolean {
  const props = getVNodeProps(vnode)
  return !!props.mediaEmbed
}

/** Extract all media from <slot name="media"> */
export function extractMediaItems(slots: any): VNode[] {
  return useSlotVNode(slots, 'media')
}

/* -------------------------------------------------------
 *  ARRAY / SLOT SHUFFLING HELPERS
 * ----------------------------------------------------- */

/** Pure Fisher–Yates shuffle that returns a new array */
export function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/* -------------------------------------------------------
 *  VUEUSE-STYLE RAW SLOT ACCESSOR
 * ----------------------------------------------------- */

/** VueUse-style helper to get raw runtime slots */
export function useSlotsTK() {
  return useSlots()
}

/* -------------------------------------------------------
 *  HIGH-LEVEL WRAPPER API
 * ----------------------------------------------------- */

export function useSlotsToolkit(slots: any) {
  return {
    slots,

    // low-level
    slot(name: string) {
      return useSlotVNode(slots, name)
    },
    propsOf: getVNodeProps,
    childrenOf: getVNodeChildren,

    // mid-level CE helpers
    heroMedia() {
      return extractHeroMedia(slots)
    },
    rows() {
      return extractCeRows(slots)
    },
    mediaItems() {
      return extractMediaItems(slots)
    },

    // For CE nodes inside layouts
    heroMediaFromNode(node: any) {
      return extractCeHeroMediaFromNode(node)
    },

    // Shuffle a plain array (e.g. rows)
    shuffle<T>(items: T[]): T[] {
      return shuffleArray(items)
    },

    // Shuffle slot entries ([name, fn][]) if randomize=true
    shuffledSlots(randomize = false): [string, any][] {
      const entries = Object.entries(slots) as [string, any][]
      if (!randomize) return entries
      return shuffleArray(entries)
    },

    // Utility
    isMediaEmbed(vnode: VNode | undefined) {
      return isVNodeMediaEmbed(vnode)
    },
  }
}
