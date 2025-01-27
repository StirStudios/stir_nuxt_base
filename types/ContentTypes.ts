import { LayoutProps, LinkProps } from './UtilityTypes'
import { MediaProps } from './MediaTypes'

export interface SectionProps extends LayoutProps {
  element: string
  id: string
  uuid: string
  layout?: string
  label?: string
  regions: Record<string, RegionItemProps[]>
}

export interface RegionItemProps extends LayoutProps {
  element: string
  id: string
  uuid: string
  parentUuid: string
  region?: string
  text?: string
  src?: string
  gradient?: string
  media?: MediaProps
  link?: LinkProps[]
  title?: string
  alt?: string
  width?: string
  height?: string
}

export interface TextProps extends LayoutProps {
  content?: string
}

export interface HTMLInjectionProps {
  html: string
}
