const subscribers = [
  require('./FetchedAllUsersSubscriber'),
  require('./AnotherFetchedAllUsersSubscriber'),
  require('./activateAccountProcessor')
]

module.exports = ({ EVENTS, logger, mailProvider }) => {
  return subscribers.map(
    (Subscriber) => new Subscriber({ EVENTS, logger, mailProvider })
  )
}
