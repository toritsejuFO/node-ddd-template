import Event from '@domain/events/interface/Event.interface'

export default interface EventHandler {
  getEventName(): string
  handle(event: Event): void
}
