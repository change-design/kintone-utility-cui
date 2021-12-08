import { AxiosError } from 'axios'

export interface KintoneError {
  url?: string
  method?: string
  data?: string
  detail?: KintoneErrorDetail
}

export interface KintoneErrorDetail {
  code: string
  id: string
  message: string
}

export const toKintoneError = (e: unknown): KintoneError => {
  const error = e as AxiosError
  return {
    url: error.response?.config?.url,
    method: error.response?.config?.method,
    data: error.response?.config?.data,
    detail: error.response?.data,
  }
}

export const isKintoneError = (e: unknown): e is KintoneError => {
  return (e as KintoneError).url !== undefined
}

export const formatKintoneError = (e: KintoneError) => {
  return `${e.detail?.message}
  {
    url: ${e.url}
    method: ${e.method}
    error: {
      code: ${e.detail?.code}
      id: ${e.detail?.id}
      message: ${e.detail?.message}
    }
    data: ${e.data}
  }`
}
