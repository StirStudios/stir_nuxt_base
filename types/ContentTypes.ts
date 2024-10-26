import { LayoutProps } from './UtilityTypes'

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
  title?: string
  alt?: string
  width?: string
  height?: string
  textRepeat?: TextRepeatProps[]
}

export interface TextProps extends LayoutProps {
  content?: string
}

export interface HTMLInjectionProps {
  html: string
}

export interface TextRepeatProps {
  text: string
}
