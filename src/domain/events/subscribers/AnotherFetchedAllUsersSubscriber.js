class AnotherFetchedAllUsersSubscriber {
  constructor({ EVENTS, logger }) {
    this.logger = logger
    this.EVENT = EVENTS.FETCHED_ALL_USERS
  }

  handler(data) {
    this.logger.info(`Event::${this.EVENT} - Subscriber::${this.constructor.name} -`, data)
  }
}

module.exports = AnotherFetchedAllUsersSubscriber
