import type { LayoutProps } from './Utility'
import type { CustomElement, ElementProps } from './Content'

export interface MediaProps {
  type?: string
  mid: string
  title: string
  src: string
  alt?: string
  width: number
  height: number
  srcset: string
  sizes: string
  platform?: string // 'youtube', 'vimeo', 'bunny', etc.
  mediaEmbed?: string // HTML for embedded players
  loading?: string // 'lazy', 'eager', etc.
}

export interface HeroProps extends LayoutProps {
  element: string
  id: string
  uuid: string
  title: string
  header?: string
  text?: string
  media: MediaProps[]
  button?: CustomElement<ElementProps>[] // formerly RegionItemProps[]
  editLink?: string
}

/**
 * Carousel of media (image, video, etc.)
 */
export interface CarouselProps extends LayoutProps {
  items: MediaProps[]
  header?: string
  amount?: string
  interval?: number
  indicators?: boolean
  arrows?: boolean
  fade?: boolean
  autoscroll?: boolean
  autoheight?: boolean
  randomize?: boolean
  overlay?: boolean
  width?: string
  vid?: string
  itemElement?: string
  editLink?: string
}

export interface VideoPlayer {
  isReady: boolean
  supports: (method: string, value: string) => boolean
  pause: () => void
  play: () => void
  mute: () => void
  unmute: () => void
  setVolume: (value: number) => void
  getVolume: (callback: (value: number) => void) => void
  getCurrentTime: (callback: (value: number) => void) => void
  setCurrentTime: (value: number) => void
  on: (event: string, callback: () => void) => void
  off: (event: string, callback?: () => void) => void
}

export type MediaElement = CustomElement<MediaProps>
