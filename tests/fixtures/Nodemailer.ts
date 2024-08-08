import MailService, {
  MailParams
} from '@/app/services/interface/MailService.interface'

export default class implements MailService {
  constructor() {}

  async sendMail(params: MailParams) {}
}
