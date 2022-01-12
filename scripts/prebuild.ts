import { copyFile } from 'fs'

const main = async () => {
  copyFile('package.json', 'dist/package.json', (err) => {
    if (err) {
      console.error('Failed to copy package.json')
      console.error(err)

      process.exit(1)
    }
  })
  copyFile('package-lock.json', 'dist/package-lock.json', (err) => {
    if (err) {
      console.error('Failed to copy package-lock.json')
      console.error(err)

      process.exit(1)
    }
  })
}

;(async () => {
  await main()
})()
