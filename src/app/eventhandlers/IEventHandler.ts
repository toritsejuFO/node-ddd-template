import Event from '@domain/events/interface/Event.interface'

export interface IEventHandler {
  getEventName(): string
  handle(event: Event): void
}
