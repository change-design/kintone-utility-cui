import { CreateSpaceResult, CreatingSpace, Space } from '../types/space'
import { getAxios } from './axios'

export interface SpaceRepository {
  getSpaceInfo: (id: string) => Promise<Space>

  create: (space: CreatingSpace) => Promise<CreateSpaceResult>
}

export const getSpaceRepository = (userId: string, password: string) => {
  return new KintoneSpaceRepository(userId, password)
}

class KintoneSpaceRepository implements SpaceRepository {
  readonly userId: string
  readonly password: string

  constructor(userId: string, password: string) {
    this.userId = userId
    this.password = password
  }

  async getSpaceInfo(id: string) {
    const axios = getAxios(this.userId, this.password)
    try {
      const res = await axios.get<Space>('/k/v1/space.json', {
        params: {
          id,
        },
      })
      return res.data
    } catch (e) {
      // FIXME
      console.log(e)
      throw e
    }
  }

  async create(space: CreatingSpace) {
    const axios = getAxios(this.userId, this.password)
    try {
      const res = await axios.post<CreateSpaceResult>(
        '/k/v1/template/space.json',
        space,
      )

      return res.data
    } catch (e) {
      // FIXME
      console.log(e)
      throw e
    }
  }
}
