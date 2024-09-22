import { EventEmitter } from 'events'

import { IEventPublisher } from '@/domain/events/IEventPublisher'
import { IEvent } from '@domain/events/IEvent'
import { IEventHandler } from '@/app/eventhandlers/IEventHandler'

export class EventPublisher extends EventEmitter implements IEventPublisher {
  constructor() {
    super()
  }

  publishEvent(event: IEvent) {
    if (event.getPayload()) {
      return this.emit(event.getName(), event)
    } else {
      return this.emit(event.getName())
    }
  }

  registerHandler(eventHandler: IEventHandler) {
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
