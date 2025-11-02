import type { LayoutProps } from '~/types/Utility'
import type { RegionItemProps } from '~/types/Content'

export interface SectionProps extends LayoutProps {
  element: string
  id: string
  uuid: string
  layout?: string
  label?: string
  gridClass?: string
  regions: Record<string, RegionItemProps[]>
  align?: string
  randomize?: boolean
}
