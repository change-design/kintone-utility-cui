import winston from 'winston'
import opener from 'opener'

const APP_LOG = 'app.log'
const ERROR_LOG = 'error.html'

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
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

  return { getLogger, openErrorLog, openAppLog }
}
