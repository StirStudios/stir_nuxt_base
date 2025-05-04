export type InputType =
  | 'text'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'password'
  | 'date'
  | 'datetime-local'
  | 'month'
  | 'time'
  | 'week'
  | 'color'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkboxes'
  | 'processed_text'
  | 'datetime'
  | 'section'

export interface DrupalFormProps {
  formId: string
  attributes: Record<string, unknown>
  method: string
  content?: string
}

export interface WebformProps {
  webform: WebformDefinition
  editLink?: string
}

export interface WebformDefinition {
  webformId: string
  webformTitle: string
  webformConfirmation: string
  webformSubmissions: string
  fields: Record<string, WebformFieldProps>
  actions: WebformActionProps[]
}

export interface WebformFieldProps {
  '#type': InputType
  '#title': string
  '#value'?: number | string
  '#name': string
  '#description'?: string
  '#placeholder'?: string
  '#required'?: boolean
  '#requiredError'?: string
  '#options'?: Record<string, string>
  '#optionProperties'?: Record<string, { price?: number; description?: string }>
  '#text'?: string
  '#min'?: number
  '#max'?: number
  '#step'?: number
  '#multiple'?: number | boolean
  '#states'?: {
    visible?:
      | Record<string, { value: string }>
      | Array<Record<string, { value: string }> | 'or'>
  }
  '#group'?: string
  '#groupMaxSelected'?: number
  '#perGuest'?: boolean
  '#isTaxable'?: boolean
  '#serviceFeeApplicable'?: boolean
  '#maxSelected'?: number
  '#tabGroup'?: string
  floatingLabel?: boolean
  '#composite'?: Record<string, WebformFieldProps>
}

export interface GroupField extends WebformFieldProps {
  children?: Record<string, WebformFieldProps>
}

export interface WebformActionProps {
  '#type': string
  '#title': string
  '#submit_label': string
}

export type WebformState = Record<
  string,
  string | number | boolean | string[] | undefined | object
>
