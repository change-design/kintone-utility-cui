import { prompt } from './util'
import { getAppRepository } from './repositories/app'
import { getAppViewRepository } from './repositories/view'
import { UpdatingAppViews } from './types/view'
import { parseUpdatingAppViewsConfig } from './excel'
import { useLogger } from './logger'

const { getLogger, openErrorLog } = useLogger()
const logger = getLogger()

export const createKintoeApp = async () => {
  const { parseConfig, updateAppViews, deployApp } = await setup()

  const { data, errors } = await parseConfig()
  if (errors.length > 0 || data == null) {
    logger.error(errors)
    openErrorLog()

    return
  }

  const { revision: appViewsUpdateRevision } = await updateAppViews(data)

  await deployApp(data.app, appViewsUpdateRevision)
}

const setup = async () => {
  const userId = await prompt('Kintoneの管理者ユーザーIDを入力してください')
  const password = await prompt('パスワードを入力してください')

  const parseConfig = async () => {
    const configPath = await prompt('Excel定義ファイルのパスを入力してください')

    const { data, errors } = parseUpdatingAppViewsConfig(configPath)
    return { data, errors }
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
