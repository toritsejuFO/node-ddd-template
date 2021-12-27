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

  registerListener(event, listener) {
    const listenerRegistered = this.listeners().find(
      (l) => String(l.name) === String(listener.name)
    )
    if (!listenerRegistered) {
      this.on(event, listener)
    }
  }
}

module.exports = CommonEventEmitter
