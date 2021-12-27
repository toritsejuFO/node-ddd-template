class FetchedAllUsersListener {
  constructor({ EVENTS, logger }) {
    this.logger = logger
    this.EVENT = EVENTS.FETCHED_ALL_USERS
  }

  handler(data) {
    this.logger.info('EVENT_EMITTED - Original hanlder - ', data)
  }
}

module.exports = FetchedAllUsersListener
