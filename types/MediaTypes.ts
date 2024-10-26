import { SharedSettings } from './BaseTypes'

export interface HeroProps extends SharedSettings {
  title: string
  element: string
  id: string
  uuid: string
  header?: string
  text?: string
  media: MediaProps[]
  editLink?: string
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

export interface MediaSettings extends SharedSettings {
  matrix?: boolean
}

export interface CarouselProps extends SharedSettings {
  items: MediaProps[]
  header?: string
  amount?: number
  interval?: number
  showIndicators?: boolean
  width?: string
  vid?: string
}
