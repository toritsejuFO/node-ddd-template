export default interface MailService {
  sendActivationEmail(user: any): Promise<any>
}
