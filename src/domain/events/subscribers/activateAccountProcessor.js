const MailService = require('../../mail/mailService')

class ActivateAccountProcessor {
  constructor(EVENTS, logger, mailProvider) {
    this.logger = logger
    this.mailService = new MailService({ mailProvider })
    this.EVENT = EVENTS.NEW_USER_CREATED
  }

  handler(user) {
    this.logger.info(
      `Event::${this.EVENT} - Subscriber::${this.constructor.name} -`,
      user
    )
    this.mailService.sendActivationEmail(user)
  }
}

module.exports = ActivateAccountProcessor
