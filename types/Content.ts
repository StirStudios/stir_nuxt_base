import type { LayoutProps, LinkProps } from '~/types/Utility'
import type { MediaProps } from '~/types/Media'

export interface RegionItemProps extends LayoutProps {
  element: string
  id: string
  uuid: string
  parentUuid: string
  region?: string
  randomize?: boolean
  text?: string
  src?: string
  gradient?: string
  media?: MediaProps
  link?: LinkProps[]
  title?: string
  alt?: string
  width?: string
  height?: string
  align?: string
  spacing?: string
}
