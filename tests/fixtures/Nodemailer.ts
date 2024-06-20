import MailService, {
  MailParams
} from '@app/services/api/MailService.interface'

export default class implements MailService {
  constructor() {}

  async sendMail(params: MailParams) {}
}
