const MailService = require('../../mail/mailService')

class ActivateAccountProcessor {
  constructor({ EVENTS, logger, mailProvider }) {
    this.logger = logger
    this.mailService = new MailService({ mailProvider })
    this.EVENT = EVENTS.NEW_USER_CREATED
  }

  handler(createdUser) {
    this.logger.info(
      `Event::${this.EVENT} - Subscriber::${this.constructor.name} -`,
      createdUser
    )
    this.mailService.sendActivationEmail(createdUser)
  }
}

module.exports = ActivateAccountProcessor
