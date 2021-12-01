import {
  App,
  CreateAppResult,
  CreatingApp,
  DeployingApp,
  UpdateAppResult,
  UpdatingApp,
} from '../types/app'
import { getAxios } from './axios'

export interface AppRepository {
  getAppInfo: (id: string) => Promise<App>

  create: (app: CreatingApp) => Promise<CreateAppResult>
  update: (app: UpdatingApp) => Promise<UpdateAppResult>
  deploy: (apps: DeployingApp[]) => Promise<void>
}

export const getAppRepository = (userId: string, password: string) => {
  return new KintoneAppRepository(userId, password)
}

class KintoneAppRepository implements AppRepository {
  readonly userId: string
  readonly password: string

  constructor(userId: string, password: string) {
    this.userId = userId
    this.password = password
  }

  async getAppInfo(id: string) {
    const axios = getAxios(this.userId, this.password)
    try {
      const res = await axios.get<App>('/k/v1/app.json', {
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

  async create(app: CreatingApp) {
    const axios = getAxios(this.userId, this.password)
    try {
      const res = await axios.post<CreateAppResult>(
        '/k/v1/preview/app.json',
        app,
      )

      return res.data
    } catch (e) {
      // FIXME
      console.log(e)
      throw e
    }
  }

  async update(app: UpdatingApp) {
    const axios = getAxios(this.userId, this.password)
    try {
      const res = await axios.put<UpdateAppResult>(
        '/k/v1/preview/app/settings.json',
        app,
      )

      return res.data
    } catch (e) {
      // FIXME
      console.log(e)
      throw e
    }
  }

  async deploy(apps: DeployingApp[]) {
    const axios = getAxios(this.userId, this.password)
    try {
      await axios.post('/k/v1/preview/app/deploy.json', { apps })
    } catch (e) {
      // FIXME
      console.log(e)
      throw e
    }
  }
}
