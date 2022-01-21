const nodemailer = require('nodemailer')

const getTemplate = require('./getTemplate')

class MailProvider {
  constructor({ config, logger }) {
    this.config = config
    this.logger = logger
    this.transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: true,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass
      }
    })
  }

  async sendMail({ to, subject, template, data }) {
    const response = await this.transporter.sendMail({
      from: this.config.mail.user,
      to,
      subject,
      html: getTemplate(template, data)
    })
    this.logger.info('MAIL_RESPONSE:', response)
  }
}

module.exports = MailProvider
