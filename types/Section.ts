// types/Section.ts
import type { LayoutProps } from './Utility'
import type { RegionElement } from './Content'

export interface SectionProps extends LayoutProps {
  element: 'paragraph-layout'
  id: string
  uuid: string
  layout?: string
  label?: string
  gridClass?: string
  align?: string
  randomize?: boolean
  regions: Record<string, RegionElement[]>
}
