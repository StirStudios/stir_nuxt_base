import type { LayoutProps, LinkProps } from './UtilityTypes'
import type { MediaProps } from './MediaTypes'

export interface SectionProps extends LayoutProps {
  element: string
  id: string
  uuid: string
  layout?: string
  label?: string
  gridClass?: string
  regions: Record<string, RegionItemProps[]>
  align?: string
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
  align?: string
  spacing?: string
}

export interface TextProps extends LayoutProps {
  content?: string
}

export interface HTMLInjectionProps {
  html: string
}

export interface ParagraphBlockProps {
  blockName: string
  blocks: Record<string, any>
}
