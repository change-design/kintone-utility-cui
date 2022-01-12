export interface UpdatingAppViews {
  app: number
  views: { [key: string]: UpdateAppView }
  revision: string | number
}

export type ViewType = 'LIST' | 'CALENDAR' | 'CUSTOM'
export type ViewDevice = 'DESKTOP' | 'ANY'

export interface UpdateAppView {
  index: string
  type: ViewType
  name?: string
  fields?: string[]
  date?: string
  title?: string
  html?: string
  pager?: boolean
  device?: ViewDevice
  filterCond?: string
  sort?: string
}

export interface UpdateAppViewResult {
  id: string
}

export interface UpdateAppViewsResult {
  revision: string
  views: { [key: string]: UpdateAppViewResult }
}
