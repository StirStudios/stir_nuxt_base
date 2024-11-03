import { LayoutProps } from './UtilityTypes'

export interface HeroProps extends LayoutProps {
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

export interface CarouselProps extends LayoutProps {
  items: MediaProps[]
  header?: string
  amount?: number
  interval?: number
  indicators?: boolean
  width?: string
  vid?: string
}
