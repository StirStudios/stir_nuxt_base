import type { LayoutProps } from './UtilityTypes'
import type { RegionItemProps } from '~/types/ContentTypes'

declare global {
  interface Window {
    playerjs: {
      Player: new (iframe: HTMLIFrameElement) => VideoPlayer
    }
  }
}

export interface HeroProps extends LayoutProps {
  title: string
  element: string
  id: string
  uuid: string
  header?: string
  text?: string
  media: MediaProps[]
  editLink?: string
  button?: RegionItemProps[]
}

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
  platform?: string
  mediaEmbed?: string
  loading?: string
}

export interface CarouselProps extends LayoutProps {
  items: MediaProps[]
  header?: string
  amount?: string
  interval?: number
  indicators?: boolean
  arrows?: boolean
  fade?: boolean
  autoscroll?: boolean
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

export {}
