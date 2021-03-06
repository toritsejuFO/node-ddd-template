const path = require('path')

module.exports = (controller, dependencies) => {
  const controllerPath = path.resolve(
    'src/interfaces/http/controller',
    controller
  )
  const Controller = require(controllerPath)
  return new Controller(dependencies)
}
