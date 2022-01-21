const subscribers = [require('./activateAccountProcessor')]

module.exports = ({ EVENTS, logger, mailProvider }) => {
  return subscribers.map(
    (Subscriber) => new Subscriber({ EVENTS, logger, mailProvider })
  )
}
