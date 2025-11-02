export interface LayoutProps {
  container?: boolean
  classes?: string
  spacing?: string
  width?: string
  header?: string
  animate?: boolean
  direction?: string
}

export interface LinkProps {
  uri: string
  title?: string
  options?: Record<string, unknown>
}
