import archiver from 'archiver'
import axios from 'axios'
import { createWriteStream } from 'fs'
import fs from 'fs'
import path from 'path'
import unzipper from 'unzipper'

const main = async () => {
  // 最終成果物名
  const packageName = process.env.PACKAGE_NAME || 'create-kintone-app-views'
  // zipファイルに含めるnode.exeのバージョン
  const nodeVersion = process.env.TARGET_NODE_VERSION || 'v16.12.0'

  const tmpDir = 'tmp'
  const buildDir = 'dist'
  const downloadFileName = `${tmpDir}/node.zip`
  const url = `https://nodejs.org/download/release/${nodeVersion}/node-${nodeVersion}-win-x64.zip`

  console.log('Target node version: ', nodeVersion)
  fs.mkdir(tmpDir, { recursive: true }, async (err) => {
    if (err) {
      console.error(`Failed to create a folder ${tmpDir}`)
      console.error(err)

      process.exit(1)
    }

    console.log(
      `Start downloading  a node release file version ${nodeVersion} from ${url}`,
    )
    const response = await axios.get(url, {
      responseType: 'stream',
    })

    // ダウンロードファイル出力ストリーム
    const writer = createWriteStream(downloadFileName)
    // ダウンロードデータ入力ストリーム
    const reader = response.data
    reader.pipe(writer, { end: true }).on('error', (error: Error) => {
      writer.destroy(error)
    })
    writer.on('finish', async () => {
      console.log('Finish downloading')
      // ダウンロード・保存が終わったら成果物に含めるファイルを抽出
      const targetFiles = ['node.exe', 'LICENSE']
      const extractedFiles = await extractFilesFromZip(
        downloadFileName,
        targetFiles,
        tmpDir,
      )
      console.log('Extracted files: ', extractedFiles)
      if (targetFiles.length !== extractedFiles.length) {
        console.error('Failed to extract target files from zip')
        console.error('  target files: ', targetFiles)
        console.error('  extracted files: ', extractedFiles)

        process.exit(1)
      }

      const outputFile = `${tmpDir}/${packageName}.zip`
      console.log(`Creating an artifact ${outputFile}`)
      // ファイル作成
      createArtifact(outputFile, [
        { type: 'Directory', path: buildDir, name: 'dist' },
        { type: 'File', path: 'main.bat', name: 'main.bat' },
        ...extractedFiles.map((f): Entry => {
          return { type: 'File', path: f, name: path.basename(f) }
        }),
      ])
    })
  })
}

/**
 * zipファイルからファイルを抽出する
 * @param zipFilePath
 * @param targetFiles
 * @param outputDir
 * @return 抽出したファイルのパス
 */
const extractFilesFromZip = async (
  zipFilePath: string,
  targetFiles: string[],
  outputDir: string,
): Promise<string[]> => {
  const result = []
  const zip = fs
    .createReadStream(zipFilePath)
    .pipe(unzipper.Parse({ forceStream: true }))
  for await (const entry of zip) {
    const path = entry.path.split('/')
    const fileName = path[path.length - 1]
    // ルートに配置されたファイルから抽出
    if (path.length === 2 && targetFiles.indexOf(fileName) !== -1) {
      console.log('Target file found: ', path.join('/'))
      const output = `${outputDir}/${fileName}`
      entry.pipe(fs.createWriteStream(output))
      result.push(output)
    } else {
      entry.autodrain()
    }
  }
  return result
}

/**
 * zipに格納する要素を表す型
 */
type Entry = {
  type: 'Directory' | 'File'
  path: string
  name: string
}
/**
 * zipファイルを作成する
 * @param zipFilePath
 * @param entries
 */
const createArtifact = (zipFilePath: string, entries: Entry[]) => {
  const zip = fs.createWriteStream(zipFilePath)
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })

  zip
    .on('close', () => {
      console.log(`An artifact has been created to ${zipFilePath}`)
    })
    .on('error', (err) => {
      console.error(`Failed to create an artifact to ${zipFilePath}`)
      throw err
    })
  archive.pipe(zip)

  entries.forEach((entry) => {
    if (entry.type === 'Directory') {
      archive.directory(entry.path, entry.name)
    } else {
      archive.append(fs.createReadStream(entry.path), { name: entry.name })
    }
  })
  archive.finalize()
}

;(async () => {
  await main()
})()
