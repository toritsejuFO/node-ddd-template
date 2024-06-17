import { Sequelize } from 'sequelize'

import { Config } from '@infra/config'
import { Logger } from '@shared/logger'
import sequelize from '@infra/sequelize'

export interface Database {
  connection: Sequelize

  connect(): void
}

export default class implements Database {
  readonly connection: any

  constructor(
    private readonly config: Config,
    private readonly logger: Logger
  ) {
    if (config.db) {
      this.connection = sequelize(this.config)
    } else {
      this.logger.error('DB_ERROR, missing config. Exiting.')
      process.exit(1)
    }
  }

  async connect() {
    this.connection.authenticate()
  }
}
