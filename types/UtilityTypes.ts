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
