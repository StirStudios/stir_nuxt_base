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
  '#type':
    | 'textfield'
    | 'email'
    | 'number'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'processed_text'
    | 'date'
    | 'datetime'
  '#title': string
  '#description'?: string
  '#placeholder'?: string
  '#required'?: boolean
  '#name': string
  '#requiredError'?: string
  '#options'?: Record<string, string>
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
  floatingLabel?: boolean
  '#composite'?: Record<string, WebformFieldProps>
}

export interface WebformActionProps {
  '#type': string
  '#title': string
  '#submit_Label': string
}

export type WebformState = Record<
  string,
  string | number | boolean | string[] | undefined | object
>
