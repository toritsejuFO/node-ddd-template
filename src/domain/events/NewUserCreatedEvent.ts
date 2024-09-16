import Event, {
  NEW_USER_CREATED
} from '@/domain/events/interface/Event.interface'

export default class NewUserCreatedEvent implements Event {
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
