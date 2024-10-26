import { SharedSettings } from './BaseTypes'

export interface WrapperProps {
  wrapper?: unknown
}

export interface AnimationProps {
  wrapper?: string
  aos?: string
  aosDelay?: number
}

export interface MediaSettings extends SharedSettings {
  matrix?: boolean
}
