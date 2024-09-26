import { Config } from '@/shared/config'
import { getLogger } from 'log4js'

export function logger(config: Config) {
  const logger = getLogger('APP')
  logger.level = config.app.logLevel ?? 'DEBUG'
  return logger
}

export type Logger = ReturnType<typeof logger>
