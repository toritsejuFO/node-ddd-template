const subscribers = [
  require('./FetchedAllUsersSubscriber'),
  require('./AnotherFetchedAllUsersSubscriber')
]

module.exports = ({ EVENTS, logger }) => {
  return subscribers.map((Subscriber) => new Subscriber({ EVENTS, logger }))
}
