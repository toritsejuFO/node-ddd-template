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
  },
  mail: {
    from: process.env.ADMIN_MAIL,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}
