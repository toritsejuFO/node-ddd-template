module.exports = (req, res) => {
  const message = `Invalid Route, cannot ${req.method} ${req.path}`
  console.log('INVALID_ROUTE_ACCESSED:', message)
  return res.status(404).json({ success: false, message })
}
