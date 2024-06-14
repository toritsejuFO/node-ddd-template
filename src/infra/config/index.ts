const config = {
  app: {
    port: process.env.APP_PORT || '4300',
    name: process.env.APP_NAME || 'App'
  },
  db: {
    url: String(process.env.DB_URI),
    options: {
      dialect: process.env.DB_DIALECT || 'postgres'
    }
  },
  jwt: {
    secret: String(process.env.JWT_SECRET)
  },
  mail: {
    from: process.env.ADMIN_MAIL,
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}

export type Config = typeof config
export default config
