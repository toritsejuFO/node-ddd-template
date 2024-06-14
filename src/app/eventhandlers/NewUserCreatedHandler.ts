import Event, { NEW_USER_CREATED } from '../../domain/events/Event.interface'
import { Logger } from '../../shared/logger'
import { UserDto } from '../dtos/UserDto'
import MailService, { MailParams } from '../services/api/MailService.interface'
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
    const user = event.getPayload()

    this.logger.info(
      `Event::${event.getName()} - EventHandler::${this.constructor.name} -`,
      user
    )

    const mailParams: MailParams = {
      to: user.email,
      subject: 'Activate your account',
      template: 'new-user-created',
      data: user
    }

    return this.mailService.sendMail(mailParams)
  }
}
