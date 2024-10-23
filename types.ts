export interface PageProps {
  title: string
  element: string
  uid?: object | string
  created: string
  hero?: Hero
  section?: Section[]
  siteInfo?: SiteInfo
}

export interface SiteInfo {
  logo?: {
    url?: string
    width?: string
    height?: string
  }
  name?: string
  slogan?: string
  mail?: string
}

export interface Hero {
  title: string
  element: string
  id: string
  uuid: string
  header?: string
  text?: string
  animate?: boolean
  direction?: string
  media: Media[]
}

export interface Section extends CommonSettings {
  element: string
  id: string
  uuid: string
  layout?: string
  label?: string
  regions: {
    [key: string]: RegionItem[]
  }
}

export interface RegionItem extends CommonSettings {
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
  textRepeat?: TextRepeatItem[]
  header?: string
}

export interface CommonSettings {
  container?: boolean
  wrapper?: string
  classes?: string
  spacing?: string
  width?: string
  header?: string
  animate?: boolean
  direction?: string
}

export interface AnimateSettings {
  wrapper?: string
  aos?: string
  aosDelay?: number
}

export interface MediaSettings extends CommonSettings {
  matrix?: boolean
}

export interface Media {
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

export interface Text extends CommonSettings {
  content?: string
}

export interface HTMLInjection {
  html: string
}

export interface TabsProps {
  tabs: {
    primary: Array<{
      url: string
      label: string
      active: boolean
    }>
  }
}

export interface CrumbProps {
  crumb?: Array<{
    url: string
    label: string
  }>
}

export interface CarouselProps extends CommonSettings {
  items: Media[]
  header?: string
  amount?: number
  interval?: number
  indicators?: boolean
  width?: string
  vid?: string

}

export interface TextRepeatItem {
  text: string
}

export interface ViewProps {
  item: {
    element: string
    viewId: string
    title: string
    gridCount: number
    spacing: string
    width: string
    carousel?: boolean
    carouselInterval?: number
    carouselIndicators?: boolean
    rows?: object[]
    pager?: object
  }
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

export interface WebformField {
  '#type': string
  '#title': string
  '#description'?: string
  '#placeholder'?: string
  '#required'?: boolean
  '#name': string
  '#requiredError'?: string
}

export interface WebformAction {
  '#type': string
  '#title': string
  '#submit_Label': string
}

export interface Webform {
  webformId: string
  webformTitle: string
  confirmationMessage: string
  fields: {
    [key: string]: WebformField
  }
  actions: WebformAction[]
}

export interface WebformProps {
  webform: Webform[]
}
