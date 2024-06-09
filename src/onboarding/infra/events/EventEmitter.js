const EventEmitter = require('events').EventEmitter

class CommonEventEmitter extends EventEmitter {
  constructor() {
    super()
  }

  emitEvent(event, ...params) {
    if (!params.length) {
      return this.emit(event, ...params)
    }

    // Enforce first parameter to be an object
    if (typeof params[0] !== 'object') {
      throw new Error(
        'Oops, if you pass event params, the first param must be an object'
      )
    } else {
      params[0].event = event
      return this.emit(event, ...params)
    }
  }

  registerSubscriber(event, subscriber) {
    const subscriberRegistered = this.listeners().find(
      (s) => String(s.name) === String(subscriber.name)
    )
    if (!subscriberRegistered) {
      this.on(event, subscriber)
    }
  }
}

module.exports = CommonEventEmitter
