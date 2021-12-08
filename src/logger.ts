import * as fs from 'fs'
import * as url from 'url'
import winston from 'winston'
import opener from 'opener'

const APP_LOG = 'app.log'
const ERROR_LOG = 'error.log'
const ERROR_HTML = 'error.html'

const timezoned = () => {
  return new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  })
}
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: timezoned }),
    // winston.format.cli(),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level} ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: APP_LOG,
      level: 'info',
    }),
    new winston.transports.File({ filename: ERROR_LOG, level: 'error' }),
  ],
})

export const useLogger = () => {
  const getLogger = () => {
    return logger
  }

  const openAppLog = () => {
    opener(APP_LOG)
  }

  const openErrorLog = () => {
    opener(ERROR_LOG)
  }

  const openErrorAsHtml = (...errors: string[]) => {
    fs.writeFileSync(ERROR_HTML, createErrorHtml(errors))
    opener(ERROR_HTML)
  }

  return { getLogger, openErrorLog, openAppLog, openErrorAsHtml }
}

const createErrorHtml = (errors: string[]) => {
  const urlErrorLog = url.pathToFileURL(ERROR_LOG)
  const urlAppLog = url.pathToFileURL(APP_LOG)
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
