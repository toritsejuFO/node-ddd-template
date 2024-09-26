import { IMailService, MailParams } from '@/app/services/IMailService'

export class MailService implements IMailService {
  constructor() {}

  async sendMail(params: MailParams) {}
}
