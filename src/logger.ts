import * as fs from 'fs'
import * as url from 'url'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
// import opener from 'opener'
import open from 'open'

const ERROR_HTML = 'error.html'
// logger初期化時に決定
let actualAppLog = ''
let actualErrLog = ''

// ログタイムスタンプのタイムゾーン設定
const timezoned = () => {
  return new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  })
}

// ログ出力先定義
const appTransport = new DailyRotateFile({
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: 10,
  dirname: 'logs',
  level: 'info',
})
appTransport.on('new', (newFilename) => {
  actualAppLog = newFilename
})
const errTransport = new DailyRotateFile({
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: 10,
  dirname: 'logs',
  level: 'error',
})
errTransport.on('new', (newFilename) => {
  actualErrLog = newFilename
})

// logger初期化
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: timezoned }),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level} ${info.message}`,
    ),
  ),
  transports: [new winston.transports.Console(), appTransport, errTransport],
})

export const useLogger = () => {
  const getLogger = () => {
    return logger
  }

  const openAppLog = () => {
    opener(actualAppLog)
  }

  const openErrorLog = () => {
    opener(actualErrLog)
  }

  const openErrorAsHtml = async (...errors: string[]) => {
    fs.writeFileSync(ERROR_HTML, createErrorHtml(errors))
    open(ERROR_HTML.toString())
  }

  return { getLogger, openErrorLog, openAppLog, openErrorAsHtml }
}

const createErrorHtml = (errors: string[]) => {
  const urlAppLog = url.pathToFileURL(actualAppLog)
  const urlErrorLog = url.pathToFileURL(actualErrLog)
  return `
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>
      .container {
        width: 90%;
        margin: 10px auto;
      }
      h1 {
        font-size: 120%;
      }
      h2 {
        font-size: 110%;
      }
      .error-detail {
        width: 100%;
        background: #ffa07a;
        padding: 10px;
        white-space: pre-wrap;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>以下エラーにより正常に終了しませんでした</h1>
        <pre class="error-detail">${errors.join('<br/>')}</pre>
        <ul>
        <h2>詳細なログは以下をご覧ください</h2>
        <li><a href="${urlErrorLog}" target="_blank">${urlErrorLog}</a></li>
        <li><a href="${urlAppLog}" target="_blank">${urlAppLog}</a></li>
        </ul>
      </div>
    </body>
  </html>
  `
}
