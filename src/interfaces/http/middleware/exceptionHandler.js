const container = require('../../../container')

module.exports = (error, req, res, next) => {
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    errorMessage: error.message
  })
}
