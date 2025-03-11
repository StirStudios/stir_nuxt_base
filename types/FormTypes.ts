export interface DrupalFormProps {
  formId: string
  attributes: Record<string, any>
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
    | 'textarea'
    | 'select'
    | 'radio'
    | 'processed_text'
  '#title': string
  '#description'?: string
  '#placeholder'?: string
  '#required'?: boolean
  '#name': string
  '#requiredError'?: string
  '#options'?: Record<string, string>
  '#text'?: string
  floatingLabel?: boolean
}

export interface WebformActionProps {
  '#type': string
  '#title': string
  '#submit_Label': string
}
