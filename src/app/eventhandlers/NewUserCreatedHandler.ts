import { RESOLVER } from 'awilix'

import { IEvent, NEW_USER_CREATED } from '@domain/events/IEvent'
import { Logger } from '@shared/logger'
import { IMailService, MailParams } from '@/app/services/IMailService'
import { IEventHandler } from '@/app/eventhandlers/IEventHandler'
import { IJwtService } from '@/app/services/IJwtService'
import { User } from '@/domain/entities/user/User'
import { Config } from '@/shared/config'

export class NewUserCreatedHandler implements IEventHandler {
  static [RESOLVER] = {}

  private readonly eventName = NEW_USER_CREATED

  constructor(
    private readonly mailService: IMailService,
    private readonly logger: Logger,
    private readonly jwtService: IJwtService,
    private readonly config: Config
  ) {
    this.handle = this.handle.bind(this)
  }

  getEventName() {
    return this.eventName
  }

  async handle(event: IEvent) {
    if (event.getName() !== this.getEventName()) {
      this.logger.warn(
        `Possible bug, kindly ensure event name of event matches handler's event name`
      )
      return
    }

    this.logger.info({
      code: 'NEW_USER_CREATED',
      message: `Event::${event.getName()} - EventHandler::${this.constructor.name}`
    })

    const user = <User>event.getPayload()
    const activationToken = this.jwtService.encode(
      user.getActivateTokenPayload()
    )

    const userObject = user.toObject()
    const mailParams = <MailParams>{
      to: userObject.email,
      subject: 'Activate your account',
      template: 'new-user-created',
      data: { ...userObject, activationToken }
    }

    try {
      if (this.config.app.isDev) {
        this.logger.info({
          code: 'IS_DEV_SKIP_MAIL',
          message: 'Mail sent successfully',
          item: { token: activationToken }
        })
      } else {
        await this.mailService.sendMail(mailParams)
      }
    } catch (error: any) {
      this.logger.error({
        code: 'FAILED_TO_SEND_EMAIL',
        message: error.message,
        item: { userId: userObject.id }
      })
      this.logger.error(error)
    }
  }
}
