import axios from 'axios'
import { Buffer } from 'buffer'

axios.defaults.baseURL = 'https://change-t.cybozu.com'

export const getAxios = (userId: string, password: string) => {
  const authString = createAuthorizationString(userId, password)
  axios.defaults.headers.common['X-Cybozu-Authorization'] = authString
  axios.defaults.headers.post['Content-Type'] = 'application/json'
  axios.defaults.headers.put['Content-Type'] = 'application/json'

  return axios
}

const createAuthorizationString = (userId: string, password: string) => {
  return Buffer.from(`${userId}:${password}`).toString('base64')
}
