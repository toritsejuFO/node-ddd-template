const sequelize = require('../sequelize')

module.exports = ({ config, logger }) => {
  if (config.db) {
    return sequelize.load(config)
  }
  logger.log('DB_ERROR, missing config. Exiting.')
  process.exit(1)
}
