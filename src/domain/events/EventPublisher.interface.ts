import EventHandler from '@app/eventhandlers/EventHandler.interface'
import Event from '@Event.interface'

export default interface EventPublisher {
  publishEvent(event: Event): void
  registerHandler(eventHandler: EventHandler): void
}
