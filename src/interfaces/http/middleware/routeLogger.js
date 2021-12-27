module.exports = (req, _, next) => {
  console.log(`ROUTE_ACCESSED: ${new Date().toISOString()}: ${req.method} - ${req.path}`)
  next()
}
