import Event from '@/domain/events/Event.interface'

export const eventName = 'NEW_USER_CREATED'

export default class NewUserCreatedEvent implements Event {
  private readonly name = eventName

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
