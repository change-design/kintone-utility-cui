import fs from 'fs'
import path from 'path'
import FormData from 'form-data'
import { UploadFileInfo } from '../types/file'
import { getAxios } from './axios'

export interface FileRepository {
  upload: (filePath: string) => Promise<UploadFileInfo>
}

export const getFileRepository = (userId: string, password: string) => {
  return new KintoneFileRepository(userId, password)
}

class KintoneFileRepository implements FileRepository {
  readonly userId: string
  readonly password: string

  constructor(userId: string, password: string) {
    this.userId = userId
    this.password = password
  }

  async upload(filePath: string) {
    const file = fs.createReadStream(filePath)
    const form = new FormData()
    form.append('name', 'file')
    form.append('file', file)
    form.append('filename', path.basename(filePath))

    const axios = getAxios(this.userId, this.password)
    try {
      const res = await axios.post<UploadFileInfo>('/k/v1/file.json', form, {
        headers: form.getHeaders(),
      })

      return res.data
    } catch (e) {
      // FIXME
      console.log(e)
      throw e
    }
  }
}
