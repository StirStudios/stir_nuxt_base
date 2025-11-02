import type { LayoutProps } from '~/types/Utility'

export interface ViewItemProps extends LayoutProps {
  element: string
  viewId: string
  title: string
  gridItems: number
  carousel?: boolean
  carouselInterval?: number
  showIndicators?: boolean
  rows?: object[]
  pager?: object
}
