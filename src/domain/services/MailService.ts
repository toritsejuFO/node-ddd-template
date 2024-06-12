import MailProvider, { MailParams } from '../providers/MailProvider.interface'
import MailService from './api/MailService.interface'

export default class implements MailService {
  constructor(private readonly mailProvider: MailProvider) {}

  sendActivationEmail(user: any) {
    const mailParams: MailParams = {
      to: user.email,
      subject: 'Activate your account',
      template: 'new-user-created',
      data: user
    }

    return this.mailProvider.sendMail(mailParams)
  }
}
