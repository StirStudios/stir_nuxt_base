import type { LayoutProps, LinkProps } from './Utility'
import type { MediaProps } from './Media'
import type { PageProps } from './Base'
import type { SectionProps } from './Section'

/**
 * Base structure for all Custom Elements
 */
export interface CustomElement<T = unknown> {
  element: string
  props?: T
  slots?: Record<string, CustomElement[]>
}

/**
 * Shared content props used by region, view, button, etc.
 */
export interface ElementProps extends LayoutProps {
  id: string
  uuid: string
  parentUuid: string
  region?: string
  randomize?: boolean
  text?: string
  src?: string
  gradient?: string
  media?: MediaProps | MediaProps[]
  link?: LinkProps[]
  title?: string
  alt?: string
  width?: string
  height?: string
  align?: string
  spacing?: string
  iconName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'link' | 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost'
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | 'neutral'
  block?: boolean
  editLink?: string
  gridItems?: string | number // Used for layout columns
  direction?: string // Animation
  overlay?: boolean // Media overlay flag
}

export type RegionElement = CustomElement<ElementProps>
export type ViewElement = CustomElement<ElementProps>
export type ButtonElement = CustomElement<ElementProps>
export type MediaElement = CustomElement<ElementProps>
export type PageElement = CustomElement<PageProps>
export type HeroElement = CustomElement<HeroProps>
export type SectionElement = CustomElement<SectionProps>
