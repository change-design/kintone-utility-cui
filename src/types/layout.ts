export interface UpdatingFormLayout {
  app: string | number
  layout: FormLayout[]
  revision: string | number
}

export type FormLayoutType = 'ROW' | 'SUBTABLE' | 'GROUP'
export type FormLayoutFieldType =
  | 'GROUP_SELECT'
  | 'SPACER' //
  | 'CHECK_BOX'
  | 'DROP_DOWN'
  | 'USER_SELECT'
  | 'RADIO_BUTTON'
  | 'LABEL' //
  | 'RICH_TEXT'
  | 'LINK'
  | 'RECORD_NUMBER'
  | 'REFERENCE_TABLE'
  | 'CALC'
  | 'HR' //
  | 'MODIFIER'
  | 'UPDATED_TIME'
  | 'CREATOR'
  | 'CREATED_TIME'
  | 'TIME'
  | 'NUMBER'
  | 'ORGANIZATION_SELECT'
  | 'FILE'
  | 'DATETIME'
  | 'DATE'
  | 'MULTI_SELECT'
  | 'SINGLE_LINE_TEXT'
  | 'MULTI_LINE_TEXT'

export type FieldNumber = string | number

export interface FormLayoutFieldSize {
  width?: FieldNumber
  height?: FieldNumber
  innerHeight?: FieldNumber
}

export interface FormLayoutField {
  type: FormLayoutFieldType
  code?: string
  label?: string
  elementId?: string
  size?: FormLayoutFieldSize
}

export interface FormLayout {
  type: FormLayoutType
  code?: string
  fields?: FormLayoutField[]
  layout?: FormLayout[]
}

export interface UpdaterFormLayoutResult {
  revision: string
}
