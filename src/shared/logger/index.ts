import { getLogger } from 'log4js'

export default function logger() {
  const logger = getLogger('APP')
  logger.level = 'DEBUG'
  return logger
}
export type Logger = ReturnType<typeof logger>
