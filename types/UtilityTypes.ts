export interface WrapperProps {
  wrapper?: unknown
}

// AnimationProps
export interface AosProps {
  wrapper?: string
  aos?: string
  aosDelay?: number
}

export interface MediaSettings extends LayoutProps {
  matrix?: boolean
}

// LayoutProps
export interface LayoutProps {
  container?: boolean
  wrapper?: string
  classes?: string
  spacing?: string
  width?: string
  header?: string
  animate?: boolean
  direction?: string
}
