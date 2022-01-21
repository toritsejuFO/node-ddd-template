class MailService {
  constructor({ mailProvider }) {
    this.mailProvider = mailProvider
  }

  sendActivationEmail(createdUser) {
    this.mailProvider.sendMail({
      to: createdUser.email,
      subject: 'Activate your account',
      template: 'new-user-created',
      data: createdUser
    })
  }
}

module.exports = MailService
