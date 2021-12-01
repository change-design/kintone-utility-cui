import { UpdaterFormLayoutResult, UpdatingFormLayout } from '../types/layout'
import { getAxios } from './axios'

export interface FormLayoutRepository {
  update: (layout: UpdatingFormLayout) => Promise<UpdaterFormLayoutResult>
}

export const getFormLayoutRepository = (userId: string, password: string) => {
  return new KintoneFormLayoutRepository(userId, password)
}

class KintoneFormLayoutRepository implements FormLayoutRepository {
  readonly userId: string
  readonly password: string

  constructor(userId: string, password: string) {
    this.userId = userId
    this.password = password
  }

  async update(layout: UpdatingFormLayout) {
    const axios = getAxios(this.userId, this.password)
    try {
      const res = await axios.put<UpdaterFormLayoutResult>(
        '/k/v1/preview/app/form/layout.json',
        layout,
      )

      return res.data
    } catch (e) {
      // FIXME
      console.log(e)
      throw e
    }
  }
}
