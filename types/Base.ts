import type { HeroProps } from '~/types/Media'
import type { SectionProps } from '~/types/Section'

export interface PageProps {
  title: string
  element?: string
  uid?: string | object
  created: string
  hero?: HeroProps
  section?: SectionProps[]
  siteInfo?: {
    logo?: {
      url?: string
      width?: string
      height?: string
    }
    name?: string
    slogan?: string
    mail?: string
  }
  prev_node?: {
    nid: string
    title: string
    url: string
  } | null
  next_node?: {
    nid: string
    title: string
    url: string
  } | null
  path?: {
    alias: string
    pid: string
    langcode: string
  }
  body?: string[]
  hide?: boolean | string
}
