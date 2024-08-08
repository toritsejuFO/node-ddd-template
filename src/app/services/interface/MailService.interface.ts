export interface MailParams {
  to: string
  subject: string
  template: string
  data: any
}

export default interface MailService {
  sendMail(mailParams: MailParams): Promise<void>
}
