import type { CustomElement } from './Content'
import type { HeroProps } from './Media'
import type { SectionProps } from './Section'

export interface PageProps {
  element: string
  props: {
    title: string
    created: string
    uid?: string | object
    hide?: boolean | string

    path?: {
      alias: string
      pid: string
      langcode: string
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
  }

  slots?: {
    hero?: CustomElement<HeroProps>
    section?: CustomElement<SectionProps>[]
  }

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

  body?: string[]
}
