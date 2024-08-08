import { EventEmitter } from 'events'

import EventPublisher from '@/domain/events/interface/EventPublisher.interface'
import Event from '@domain/events/interface/Event.interface'
import EventHandler from '@/app/eventhandlers/interface/EventHandler.interface'

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
      (h) => String(h.name) === String(eventHandler.handle.name)
    )

    // Avoid duplicate handler registration for the same event for whatever reason
    if (!registered) {
      // handle method must already be bound to the instance of the eventHandler
      this.on(eventHandler.getEventName(), eventHandler.handle)
    }
  }
}
