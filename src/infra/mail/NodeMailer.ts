import { Transporter, createTransport } from 'nodemailer'

import { Config } from '@shared/config'
import { Logger } from '@shared/logger'
import getTemplate from '@infra/mail/getTemplate'
import { IMailService, MailParams } from '@/app/services/IMailService'

export class MailService implements IMailService {
  private readonly transporter: Transporter

  constructor(
    private readonly config: Config,
    private readonly logger: Logger
  ) {
    this.transporter = createTransport({
      host: this.config.mail.host,
      port: this.config.mail.port,
      secure: true,
      auth: {
        user: this.config.mail.user,
        pass: this.config.mail.pass
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
