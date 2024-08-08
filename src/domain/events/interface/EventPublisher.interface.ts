import EventHandler from '@/app/eventhandlers/interface/EventHandler.interface'
import Event from '@/domain/events/interface/Event.interface'

export default interface EventPublisher {
  publishEvent(event: Event): void
  registerHandler(eventHandler: EventHandler): void
}
