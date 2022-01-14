const listeners = [
  require('./FetchedAllUsersListener'),
  require('./AnotherFetchedAllUsersListener')
]

module.exports = ({ EVENTS, logger }) => {
  return listeners.map((Listener) => new Listener({ EVENTS, logger }))
}
