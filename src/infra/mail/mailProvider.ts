import { Transporter, createTransport } from 'nodemailer'

import { MailParams } from './interface'
import { Config } from '../config'
import { Logger } from '../logger'

import getTemplate from './getTemplate'

export default class MailProvider {
  config: Config
  logger: Logger
  transporter: Transporter

  constructor(config: Config, logger: Logger) {
    this.config = config
    this.logger = logger
    this.transporter = createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: true,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass
      }
    })
  }

  async sendMail(params: MailParams) {
    const response = await this.transporter.sendMail({
      from: this.config.mail.from,
      to: params.to,
      subject: params.subject,
      html: getTemplate(params.template, params.data)
    })
    this.logger.info('MAIL_RESPONSE:', response)
  }
}

module.exports = MailProvider
