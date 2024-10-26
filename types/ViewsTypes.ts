import { LayoutProps } from './UtilityTypes'

export interface ViewProps {
  item: ViewItemProps
}

export interface ViewItemProps extends LayoutProps {
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
