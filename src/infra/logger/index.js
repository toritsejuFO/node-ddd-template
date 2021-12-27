const Log4js = require('log4js')

module.exports = () => {
  const logger = Log4js.getLogger('APP')
  logger.level = 'DEBUG'
  return logger
}
