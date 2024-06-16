import Event from '../../domain/events/Event.interface'

export default interface EventHandler {
  getEventName(): string
  handler(event: Event): void
}
