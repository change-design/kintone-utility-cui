import { createKintoeApp } from './kintone'

const main = async () => {
  await createKintoeApp()
}

;(async () => {
  try {
    await main()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
