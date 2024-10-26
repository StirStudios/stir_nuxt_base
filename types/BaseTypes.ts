import { HeroProps } from './MediaTypes'
import { SectionProps } from './ContentTypes'

export interface PageProps {
  title: string
  element: string
  uid?: string | object
  created: string
  hero?: HeroProps
  section?: SectionProps[]
  siteInfo?: SiteInfoProps
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

export interface SharedSettings {
  container?: boolean
  wrapper?: string
  classes?: string
  spacing?: string
  width?: string
  header?: string
  animate?: boolean
  direction?: string
}
