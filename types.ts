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

export interface SectionProps extends SharedSettings {
  element: string
  id: string
  uuid: string
  layout?: string
  label?: string
  regions: Record<string, RegionItemProps[]>
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

export interface AnimationProps {
  wrapper?: string
  aos?: string
  aosDelay?: number
}

export interface TabsProps {
  tabs: {
    primary: TabItemProps[]
  }
}

export interface TabItemProps {
  url: string
  label: string
  active: boolean
}

export interface CrumbProps {
  crumbs?: CrumbItemProps[]
}

export interface CrumbItemProps {
  url: string
  label: string
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

export interface IconsSocialProps {
  title: string
  tooltip: string
  url: string
  icon: string
  iconSize?: string
  activeClass?: string
  inactiveClass?: string
}

export interface WebformProps {
  webform: WebformDefinition[]
  editLink?: string
}

export interface WebformDefinition {
  webformId: string
  webformTitle: string
  webformConfirmation: string
  webformSubmissions: string
  fields: Record<string, WebformFieldProps>
  actions: WebformActionProps[]
}

export interface WebformFieldProps {
  '#type': string
  '#title': string
  '#description'?: string
  '#placeholder'?: string
  '#required'?: boolean
  '#name': string
  '#requiredError'?: string
}

export interface WebformActionProps {
  '#type': string
  '#title': string
  '#submit_Label': string
}

export interface ViewProps {
  item: ViewItemProps
}

export interface ViewItemProps extends SharedSettings {
  element: string
  viewId: string
  title: string
  gridCount: number
  carousel?: boolean
  carouselInterval?: number
  showIndicators?: boolean
  rows?: object[]
  pager?: object
}

export interface ViewsPagerProps {
  current: number
  totalPages: number
  maxLinks: number
}

export interface EditLinkProps {
  link?: string
}

export interface DrupalFormProps {
  formId: string
  attributes: Record<string, any>
  method: string
  content?: string
}

export interface WrapperProps {
  wrapper?: unknown
}
