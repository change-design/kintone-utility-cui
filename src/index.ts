import { updateKintoneApp } from './kintone'

const main = async () => {
  await updateKintoneApp()
}

;(async () => {
  try {
    await main()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
