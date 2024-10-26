import { SharedSettings } from './BaseTypes'

export interface SectionProps extends SharedSettings {
  element: string
  id: string
  uuid: string
  layout?: string
  label?: string
  regions: Record<string, RegionItemProps[]>
}

export interface RegionItemProps extends SharedSettings {
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

export interface TextProps extends SharedSettings {
  content?: string
}

export interface HTMLInjectionProps {
  html: string
}

export interface TextRepeatProps {
  text: string
}
