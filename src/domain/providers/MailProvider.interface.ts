export interface MailParams {
  to: string
  subject: string
  template: string
  data: string
}

export default interface MailProvider {
  sendMail(mailParams: MailParams): Promise<void>
}
