import * as fs from 'fs'
import { prompt } from './util'
import { getAppRepository } from './repositories/app'
import { getAppViewRepository } from './repositories/view'
import { UpdatingAppViews } from './types/view'
import { parseUpdatingAppViewsConfig } from './excel'
import { useLogger } from './logger'
import {
  formatKintoneError,
  isKintoneError,
  KintoneError,
} from './repositories/error'

const { getLogger, openErrorAsHtml } = useLogger()
const logger = getLogger()

export const updateKintoneApp = async () => {
  logger.info('ツールを起動します...')
  const { parseConfig, updateAppViews, deployApp } = await setup()

  logger.info('Excelファイル読み込み...')
  const { data, errors } = await parseConfig()
  if (errors.length > 0 || data == null) {
    logger.error(errors)
    openErrorAsHtml(...errors)

    return
  }

  try {
    logger.info('kintoneへ登録...')
    const { revision: appViewsUpdateRevision } = await updateAppViews(data)
    await deployApp(data.app, appViewsUpdateRevision)

    logger.info('終了しました。kintoneにログインして結果を確認してください')
  } catch (e) {
    if (isKintoneError(e)) {
      const error = e as KintoneError
      const msg = formatKintoneError(error)
      logger.error(msg)
      openErrorAsHtml(msg)
    } else {
      logger.error(e)
    }
    return Promise.reject(e)
  }
}

const setup = async () => {
  const userId = await prompt('Kintoneの管理者ユーザーIDを入力してください')
  const password = await prompt('パスワードを入力してください')

  const parseConfig = async (): Promise<{
    data: UpdatingAppViews | null
    errors: string[]
  }> => {
    const configPath = await prompt('Excel定義ファイルのパスを入力してください')
    if (fs.existsSync(configPath)) {
      const { data, errors } = parseUpdatingAppViewsConfig(configPath)
      return { data, errors }
    } else {
      console.error(`ファイル ${configPath} が存在しません`)
      return parseConfig()
    }
  }

  const appRepository = getAppRepository(userId, password)
  const deployApp = async (app: string | number, revision: string | number) => {
    const deployingApps = [{ app, revision }]
    await appRepository.deploy(deployingApps)
  }

  // 一覧設定
  const appViewRepository = getAppViewRepository(userId, password)
  const updateAppViews = async (data: UpdatingAppViews) => {
    return await appViewRepository.update(data)
  }

  return {
    userId,
    password,
    parseConfig,
    updateAppViews,
    deployApp,
  }
}
