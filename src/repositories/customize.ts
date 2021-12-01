import {
  UpdateAppCustomizeResult,
  UpdatingAppCustomize,
} from '../types/customize'
import { getAxios } from './axios'

export interface AppCustomizeRepository {
  update: (customize: UpdatingAppCustomize) => Promise<UpdateAppCustomizeResult>
}

export const getAppCustomizeRepository = (userId: string, password: string) => {
  return new KintoneAppCustomizeRepository(userId, password)
}

class KintoneAppCustomizeRepository implements AppCustomizeRepository {
  readonly userId: string
  readonly password: string

  constructor(userId: string, password: string) {
    this.userId = userId
    this.password = password
  }

  async update(customize: UpdatingAppCustomize) {
    const axios = getAxios(this.userId, this.password)
    try {
      const res = await axios.put<UpdateAppCustomizeResult>(
        '/k/v1/preview/app/customize.json',
        customize,
      )

      return res.data
    } catch (e) {
      // FIXME
      console.log(e)
      throw e
    }
  }
}
