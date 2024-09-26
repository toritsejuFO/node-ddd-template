import { IEventHandler } from '@/app/eventhandlers/IEventHandler'
import { IEvent } from '@/domain/events/IEvent'

export interface IEventPublisher {
  publishEvent(event: IEvent): void
  registerHandler(eventHandler: IEventHandler): void
}
