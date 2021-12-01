import { UpdateAppViewsResult, UpdatingAppViews } from '../types/view'
import { getAxios } from './axios'

export interface AppViewRepository {
  update: (views: UpdatingAppViews) => Promise<UpdateAppViewsResult>
}

export const getAppViewRepository = (userId: string, password: string) => {
  return new KintoneAppViewRepository(userId, password)
}

class KintoneAppViewRepository implements AppViewRepository {
  readonly userId: string
  readonly password: string

  constructor(userId: string, password: string) {
    this.userId = userId
    this.password = password
  }

  async update(views: UpdatingAppViews) {
    const axios = getAxios(this.userId, this.password)
    try {
      const res = await axios.put<UpdateAppViewsResult>(
        '/k/v1/preview/app/views.json',
        views,
      )

      return res.data
    } catch (e) {
      // FIXME
      console.log(e)
      throw e
    }
  }
}
