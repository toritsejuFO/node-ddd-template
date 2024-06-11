import { Sequelize } from 'sequelize'
import { Config } from '../config'
import { Logger } from '../logger'
import sequelize from '../sequelize'

export interface Database {
  instance: Sequelize

  start(): void
}

export default class implements Database {
  readonly instance: any

  constructor(config: Config, logger: Logger) {
    if (config.db) {
      this.instance = sequelize(config)
    } else {
      logger.error('DB_ERROR, missing config. Exiting.')
      process.exit(1)
    }
  }

  async start() {
    this.instance.authenticate()
  }
}
