import { UploadFileInfo } from './file'

export type CustomizeScope = 'ALL' | 'ADMIN' | 'NONE'
export type CustomizeFileType = 'URL' | 'FILE'

export interface CustomizeFile {
  type?: CustomizeFileType
  url?: string
  file?: UploadFileInfo
}

export interface CustomizeConfig {
  js?: CustomizeFile[]
  css?: CustomizeFile[]
}

export interface UpdatingAppCustomize {
  app: string | number
  scope?: CustomizeScope
  desktop?: CustomizeConfig
  mobile?: CustomizeConfig
  revision: string | number
}

export interface UpdateAppCustomizeResult {
  revision: string
}
