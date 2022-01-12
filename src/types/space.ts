import { App } from './app'
import { User } from './user'

export type CoverType = 'BLOB' | 'PRESET'

export interface Space {
  id: string
  name: string
  defaultThread: string
  isPrivate: boolean
  creator: User
  modifier: User
  coverType: CoverType
  coverKey: string
  coverUrl: string
  body: string | null
  useMultiThread: boolean
  isGuest: boolean
  attachedApps: App[]
  fixedMember: boolean
  showAnnouncement: boolean
  showThreadList: boolean
  showAppList: boolean
  showMemberList: boolean
  showRelatedLinkList: boolean
}

export type SpaceMemberEntityType = 'USER' | 'GROUP' | 'ORGANIZATION'
export interface SpaceMemberEntity {
  type: SpaceMemberEntityType
  code: string
}

export interface SpaceMember {
  entity: SpaceMemberEntity
  isAdmin?: boolean | string
  includeSubs?: boolean | string
}

export type SpaceBoolean = boolean | 'true' | 'false'
export interface CreatingSpace {
  id: string
  name: string
  members: SpaceMember[]
  isPrivate?: SpaceBoolean
  isGuest?: SpaceBoolean
  fixedMember?: SpaceBoolean
}

export interface CreateSpaceResult {
  id: string
}

export interface UpdateSpaceResult {
  revision: string
}
