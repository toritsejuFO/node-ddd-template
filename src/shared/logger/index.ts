import { Config } from '@/infra/config'
import { getLogger } from 'log4js'

export default function logger(config: Config) {
  const logger = getLogger('APP')
  logger.level = config.app.logLevel ?? 'DEBUG'
  return logger
}
export type Logger = ReturnType<typeof logger>
