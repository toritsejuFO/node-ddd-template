import { IEvent, NEW_USER_CREATED } from '@/domain/events/IEvent'

export class NewUserCreatedEvent implements IEvent {
  private readonly name = NEW_USER_CREATED

  constructor(private readonly payload: any) {
    this.payload = payload
  }

  getName(): string {
    return this.name
  }

  getPayload(): any {
    return this.payload
  }
}
