import {
  AddFieldsResult,
  CreatingFormFields,
  UpdateFieldsResult,
  UpdatingFormFields,
} from '../types/field'
import { getAxios } from './axios'

export interface FormFieldRepository {
  add: (fields: CreatingFormFields) => Promise<AddFieldsResult>
  update: (fields: UpdatingFormFields) => Promise<UpdateFieldsResult>
}

export const getFormFieldRepository = (userId: string, password: string) => {
  return new KintoneFormFieldRepository(userId, password)
}

class KintoneFormFieldRepository implements FormFieldRepository {
  readonly userId: string
  readonly password: string

  constructor(userId: string, password: string) {
    this.userId = userId
    this.password = password
  }

  async add(fields: CreatingFormFields) {
    const axios = getAxios(this.userId, this.password)
    try {
      const res = await axios.post<AddFieldsResult>(
        '/k/v1/preview/app/form/fields.json',
        fields,
      )

      return res.data
    } catch (e) {
      // FIXME
      console.log(e)
      throw e
    }
  }

  async update(fields: UpdatingFormFields) {
    const axios = getAxios(this.userId, this.password)
    try {
      const res = await axios.put<UpdateFieldsResult>(
        '/k/v1/preview/app/form/fields.json',
        fields,
      )

      return res.data
    } catch (e) {
      // FIXME
      console.log(e)
      throw e
    }
  }
}
