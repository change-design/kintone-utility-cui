import { UploadFileInfo } from './file'
import { User } from './user'

export interface App {
  appId: string
  code: string
  name: string
  description: string
  createdAt: string
  creator: User
  modifiedAt: string
  modifier: User
  spaceId: number
  threadId: number
}

export type IconType = 'PRESET' | 'FILE'
export interface AppIcon {
  type: IconType
  key: string
  file?: UploadFileInfo
}
export interface CreatingApp {
  name: string
  space?: number
  thread?: number
}

export type AppTheme =
  | 'WHITE'
  | 'RED'
  | 'BLUE'
  | 'GREEN'
  | 'YELLOW'
  | 'BLACK'
  | ''

export interface UpdatingApp {
  app: string | number
  name?: string
  description?: string
  icon?: AppIcon
  theme?: AppTheme
  revision?: string | number
}

export interface DeployingApp {
  app: string | number
  revision: string | number
}

export interface CreateAppResult {
  app: string
  revision: string
}

export interface UpdateAppResult {
  revision: string
}
