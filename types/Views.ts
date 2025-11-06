import type { LayoutProps } from './Utility'

export interface ViewProps extends LayoutProps {
  element: string
  viewId: string
  title: string
  gridItems: number | string
  carousel?: boolean
  carouselInterval?: number
  showIndicators?: boolean
  randomize?: boolean
  rows?: Record<string, unknown>[] // or a typed RowProps if structure is known
  pager?: {
    current: number
    total: number
    hasMore: boolean
    nextUrl?: string
  }
}
