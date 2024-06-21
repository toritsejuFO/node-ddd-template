const config = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.APP_PORT || '4300',
    name: process.env.APP_NAME || 'App',
    logLevel: process.env.LOG_LEVEL || 'DEBUG'
  },
  db: {
    url: String(process.env.DB_URI),
    options: {
      dialect: process.env.DB_DIALECT || 'postgres',
      storage: process.env.DB_STORAGE || null,
      logging: process.env.DB_LOGGING === 'true',
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
