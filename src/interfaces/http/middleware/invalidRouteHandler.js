module.exports =
  ({ logger }) =>
  (req, res) => {
    const message = `Invalid Route, cannot ${req.method} ${req.path}`
    logger.info('INVALID_ROUTE:', message)
    return res.status(404).json({ success: false, message })
  }
