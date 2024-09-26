export type MailParams = {
  to: string
  subject: string
  template: string
  data: any
}

export interface IMailService {
  sendMail(mailParams: MailParams): Promise<void>
}
