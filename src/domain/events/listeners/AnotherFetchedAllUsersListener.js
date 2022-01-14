class AnotherFetchedAllUsersListener {
  constructor({ EVENTS, logger }) {
    this.logger = logger
    this.EVENT = EVENTS.FETCHED_ALL_USERS
  }

  handler(data) {
    this.logger.info('EVENT_EMITTED - Another handler -', data)
  }
}

module.exports = AnotherFetchedAllUsersListener
