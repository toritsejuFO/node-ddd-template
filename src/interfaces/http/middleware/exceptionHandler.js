module.exports =
  ({ logger }) =>
  (error, req, res, next) => {
    logger.error(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      errorMessage: error.message
    })
  }
