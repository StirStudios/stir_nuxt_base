// AnimationProps
export interface AosProps {
  effect?: string
}

export interface MediaSettings extends LayoutProps {
  matrix?: boolean
}

// LinkProps
export interface LinkProps {
  uri: string
  title?: string
  options?: Record<string, unknown>
}

// LayoutProps
export interface LayoutProps {
  container?: boolean
  classes?: string
  spacing?: string
  width?: string
  header?: string
  animate?: boolean
  direction?: string
}

// Calendly
export interface CalendlyClient {
  initInlineWidget(options: { url: string; parentElement: HTMLElement }): void
}

// Userway
declare global {
  interface Window {
    _userway_config?: {
      account: string
      position?: number
      size?: 'small' | 'medium' | 'large'
      color?: string
      type?: string
      [key: string]: unknown
    }
  }
}
