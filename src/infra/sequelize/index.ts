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

  fs.readdirSync(MODELS_PATH).forEach((file) => {
    const modelPath = path.resolve(MODELS_PATH, file)
    import(modelPath).then((Model) => {
      Model.init(sequelize)
    })
  })

  return sequelize
}