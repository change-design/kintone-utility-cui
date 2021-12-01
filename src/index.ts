import { createKintoeApp } from './kintone'

const main = async () => {
  await createKintoeApp()
}

;(async () => {
  await main()
})()
