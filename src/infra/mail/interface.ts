export interface MailParams {
  to: string
  subject: string
  template: string
  data: string
}

export interface IMailProvider {
  sendMail(mailParams: MailParams): Promise<void>
}
