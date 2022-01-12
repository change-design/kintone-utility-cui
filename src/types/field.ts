export interface CreatingFormFields {
  app: string | number
  properties: { [key: string]: FormFieldProperty }
  revision: string | number
}

export interface UpdatingFormFields {
  app: string | number
  properties: { [key: string]: UpdateFormFieldProperty }
  revision: string | number
}

export type PropertyBoolean = boolean | 'true' | 'false'
export type PropertyNumber = string | number
export type PropertyType =
  | 'GROUP'
  | 'GROUP_SELECT'
  | 'CHECK_BOX'
  | 'SUBTABLE'
  | 'DROP_DOWN'
  | 'USER_SELECT'
  | 'RADIO_BUTTON'
  | 'RICH_TEXT'
  | 'LINK'
  | 'REFERENCE_TABLE'
  | 'CALC'
  | 'TIME'
  | 'NUMBER'
  | 'ORGANIZATION_SELECT'
  | 'FILE'
  | 'DATETIME'
  | 'DATE'
  | 'MULTI_SELECT'
  | 'SINGLE_LINE_TEXT'
  | 'MULTI_LINE_TEXT'
export type UpdatePropertyType =
  | PropertyType
  | 'RECORD_NUMBER'
  | 'CREATOR'
  | 'CREATED_TIME'
  | 'MODIFIER'
  | 'UPDATED_TIME'
export type PropertyValueType = 'USER' | 'GROUP' | 'ORGANIZATION' | 'FUNCTION'
export type PropertyAlign = 'HORIZONTAL' | 'VERTICAL'
export type PropertyThumbnailSize = 50 | 150 | 250 | 500
export type PropertyProtocol = 'WEB' | 'CALL' | 'MAIL'
export type PropertyFormat =
  | 'NUMBER'
  | 'NUMBER_DIGIT'
  | 'DATETIME'
  | 'DATE'
  | 'TIME'
  | 'HOUR_MINUTE'
  | 'DAY_HOUR_MINUTE'
export type PropertyUnitPosition = 'BEFORE' | 'AFTER'
export type PropertySelection = {
  type: PropertyValueType
  code: string
}
export interface PropertyOption {
  label: string
  index: PropertyNumber
}

export type PropertyEntityType = 'USER' | 'GROUP' | 'ORGANIZATION'
export interface PropertyEntity {
  type: PropertyEntityType
  code: string
}

export interface PropertyRelatedApp {
  app?: PropertyNumber
  code?: string
}
export interface PropertyReferenceTableCondition {
  field: string
  relatedField: string
}

export type PropertyReferenceTableMaxRecordSize =
  | 5
  | 10
  | 20
  | 30
  | 40
  | 50
  | '5'
  | '10'
  | '20'
  | '30'
  | '40'
  | '50'
export interface PropertyReferenceTable {
  relatedApp: PropertyRelatedApp
  condition: PropertyReferenceTableCondition
  filterCond?: string
  displayFields: string[]
  sort?: string
  size?: PropertyReferenceTableMaxRecordSize
}

export interface PropertyLookupFieldMapping {
  field: string
  relatedField: string
}
export interface PropertyLookup {
  relatedApp: PropertyRelatedApp
  relatedKeyField: string
  fieldMappings?: PropertyLookupFieldMapping[]
  lookupPickerFields?: string[]
  filterCond?: string
  sort?: string
}

export interface FormFieldProperty {
  type: PropertyType
  code: string
  label?: string
  noLabel?: PropertyBoolean
  required?: PropertyBoolean
  unique?: PropertyBoolean
  maxValue?: PropertyNumber
  minValue?: PropertyNumber
  maxLength?: PropertyNumber
  minLength?: PropertyNumber
  defaultValue?: string | PropertySelection[]
  options?: { [key: string]: PropertyOption }
  align?: PropertyAlign
  expression?: string
  hideExpression?: PropertyBoolean
  digit?: PropertyBoolean
  thumbnailSize?: PropertyThumbnailSize
  protocol?: PropertyProtocol
  format?: PropertyFormat
  displayScale?: PropertyNumber
  unit?: string
  unitPosition?: PropertyUnitPosition
  entities?: PropertyEntity[]
  referenceTable?: PropertyReferenceTable
  lookup?: PropertyLookup
  openGroup?: PropertyBoolean
  fields?: { [key: string]: FormFieldProperty }
}

/**
 * フィールド更新時に限って指定できるtypeがあるため、typeを差し替え
 */
export type UpdateFormFieldProperty = Omit<FormFieldProperty, 'type'> & {
  type: UpdatePropertyType
}

export interface AddFieldsResult {
  revision: string
}
export type UpdateFieldsResult = AddFieldsResult
