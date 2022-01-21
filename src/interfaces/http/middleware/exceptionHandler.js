const { StatusCodes } = require('http-status-codes')

module.exports =
  ({ logger }) =>
  (error, req, res, next) => {
    logger.error(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    })
  }
