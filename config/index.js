require('dotenv').config()

module.exports = {
  app: {
    port: process.env.APP_PORT || '4300'
  },
  db: {
    url: process.env.DATABASE_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET
  }
}
