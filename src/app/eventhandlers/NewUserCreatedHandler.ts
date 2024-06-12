import Event, { NEW_USER_CREATED } from '../../domain/events/Event.interface'
import MailService from '../../domain/services/api/MailService.interface'
import { Logger } from '../../infra/logger'
import EventHandler from './EventHandler.interface'

export default class NewUserCreatedHandler implements EventHandler {
  private readonly eventName = NEW_USER_CREATED

  constructor(
    private readonly mailService: MailService,
    private readonly logger: Logger
  ) {
    this.handler = this.handler.bind(this)
  }

  getEventName() {
    return this.eventName
  }

  handler(event: Event) {
    this.logger.info(
      `Event::${event.getName()} - EventHandler::${this.constructor.name} -`,
      event.getPayload()
    )
    this.mailService.sendActivationEmail(event.getPayload())
  }
}
