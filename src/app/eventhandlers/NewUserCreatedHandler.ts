import Event, {
  NEW_USER_CREATED
} from '@domain/events/interface/Event.interface'
import { Logger } from '@shared/logger'
import MailService, {
  MailParams
} from '@/app/services/interface/MailService.interface'
import EventHandler from '@/app/eventhandlers/interface/EventHandler.interface'
import JwtService from '@/app/services/interface/JwtService.interface'
import User from '@/domain/entities/user/User'

export default class NewUserCreatedHandler implements EventHandler {
  private readonly eventName = NEW_USER_CREATED

  constructor(
    private readonly mailService: MailService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService
  ) {
    this.handle = this.handle.bind(this)
  }

  getEventName() {
    return this.eventName
  }

  handle(event: Event) {
    if (event.getName() !== this.getEventName()) {
      this.logger.warn(
        `Possible bug, kindly ensure event name of event matches handler's event name`
      )
      return
    }

    this.logger.info(
      `Event::${event.getName()} - EventHandler::${this.constructor.name}`
    )

    const user: User = event.getPayload()
    const activationToken = this.jwtService.encode(
      user.getActivateTokenPayload()
    )

    const userObject = user.toObject()
    const mailParams: MailParams = {
      to: userObject.email,
      subject: 'Activate your account',
      template: 'new-user-created',
      data: { ...userObject, activationToken }
    }

    return this.mailService.sendMail(mailParams)
  }
}
