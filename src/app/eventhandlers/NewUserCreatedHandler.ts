import Event, { NEW_USER_CREATED } from '@domain/events/Event.interface'
import { Logger } from '@shared/logger'
import MailService, {
  MailParams
} from '@app/services/api/MailService.interface'
import EventHandler from '@app/eventhandlers/EventHandler.interface'
import JwtService from '@app/services/api/JwtService.interface'
import User from '@/domain/entities/user/User'

export default class NewUserCreatedHandler implements EventHandler {
  private readonly eventName = NEW_USER_CREATED

  constructor(
    private readonly mailService: MailService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService
  ) {
    this.handler = this.handler.bind(this)
  }

  getEventName() {
    return this.eventName
  }

  handler(event: Event) {
    const user: User = event.getPayload()
    const userObject = user.toObject()

    this.logger.info(
      `Event::${event.getName()} - EventHandler::${this.constructor.name} -`,
      user
    )

    const activationToken = this.jwtService.encode(
      user.getActivateTokenPayload()
    )

    const mailParams: MailParams = {
      to: userObject.email,
      subject: 'Activate your account',
      template: 'new-user-created',
      data: { ...userObject, activationToken }
    }

    return this.mailService.sendMail(mailParams)
  }
}
