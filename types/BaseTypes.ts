import { HeroProps } from './MediaTypes'
import { SectionProps } from './ContentTypes'

export interface NodeLinkProps {
  nid: string
  title: string
  url: string
}

export interface PathProps {
  alias: string
  pid: string
  langcode: string
}

export interface PageProps {
  title: string
  element: string
  uid?: string | object
  created: string
  hero?: HeroProps
  section?: SectionProps[]
  siteInfo?: SiteInfoProps
  prev_node?: NodeLinkProps | null
  next_node?: NodeLinkProps | null
  path?: PathProps
}

export interface SiteInfoProps {
  logo?: LogoProps
  name?: string
  slogan?: string
  mail?: string
}

export interface LogoProps {
  url?: string
  width?: string
  height?: string
}
