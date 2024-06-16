import fs from 'fs'
import path from 'path'

import { Dialect, Sequelize } from 'sequelize'

import { Config } from '../config'

const MODELS_PATH = path.resolve(__dirname, 'models')

export default (config: Config) => {
  const sequelize = new Sequelize(
    config.db.url,
    config.db.options as unknown as Dialect
  )

  fs.readdirSync(MODELS_PATH).forEach(async (file) => {
    const modelPath = path.resolve(MODELS_PATH, file)
    const Model = require(modelPath)
    Model.init(sequelize)
  })

  return sequelize
}
