import { SharedSettings } from './BaseTypes'

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
