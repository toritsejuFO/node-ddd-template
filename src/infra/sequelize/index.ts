import fs from 'fs'
import path from 'path'

import { Dialect, Sequelize } from 'sequelize'

import { Config } from '@infra/config'

const MODELS_PATH = path.resolve(__dirname, 'models')

export default (config: Config) => {
  let sequelize

  if (config.app.env === 'test') {
    sequelize = new Sequelize(config.db.options as unknown as Dialect)
  } else {
    sequelize = new Sequelize(
      config.db.url,
      config.db.options as unknown as Dialect
    )
  }

  fs.readdirSync(MODELS_PATH).forEach(async (file) => {
    const modelPath = path.resolve(MODELS_PATH, file)
    const Model = require(modelPath)
    Model.init(sequelize)
  })

  return sequelize
}
