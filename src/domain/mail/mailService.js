class MailService {
  constructor({ mailProvider }) {
    this.mailProvider = mailProvider
  }

  sendActivationEmail(user) {
    this.mailProvider.sendMail({
      to: user.email,
      subject: 'Activate your account',
      template: 'new-user-created',
      data: user
    })
  }
}

module.exports = MailService
