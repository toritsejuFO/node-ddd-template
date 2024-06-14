import { EventEmitter } from 'events'

import EventPublisher from '../../domain/events/EventPublisher.interface'
import Event from '../../domain/events/Event.interface'
import EventHandler from '../../app/eventhandlers/EventHandler.interface'

export default class extends EventEmitter implements EventPublisher {
  constructor() {
    super()
  }

  publishEvent(event: Event) {
    if (event.getPayload()) {
      return this.emit(event.getName(), event)
    } else {
      return this.emit(event.getName())
    }
  }

  registerHandler(eventHandler: EventHandler) {
    const registered = this.listeners(eventHandler.getEventName()).find(
      (h) => String(h.name) === String(eventHandler.handler.name)
    )

    // Avoid duplicate handler registration for whatever reason
    if (!registered) {
      // handler is bound to the instance of the eventHandler
      this.on(eventHandler.getEventName(), eventHandler.handler)
    }
  }
}
