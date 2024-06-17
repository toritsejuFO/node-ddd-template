import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import UserRepository from '@domain/repositories/UserRepository.interface'
import JwtService from '@app/services/api/JwtService.interface'
import { IAdapter } from 'types-ddd'
import User from '@domain/entities/user/User'
import { UserDto } from '@app/dtos/UserDto'

export default (
    jwtService: JwtService,
    userRepository: UserRepository,
    toDtoAdapter: IAdapter<User, UserDto>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.get('X-Auth-Token')
    let email, id, user

    if (!token) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .send({ success: false, message: 'X-Auth-Token header is required' })
    }

    try {
      const decodedPayload = jwtService.verify(token)
      ;({ email, id } = decodedPayload)
    } catch (error: any) {
      return res.status(StatusCodes.FORBIDDEN).send({
        success: false,
        message: 'Could not validate X-Auth-Token',
        error: error.message
      })
    }

    try {
      user = await userRepository.findOneByIdAndEmail(id, email)
      if (!user) throw new Error()
      req.user = toDtoAdapter.build(user).value()
    } catch (error) {
      return res.status(StatusCodes.FORBIDDEN).send({
        success: false,
        message: 'Unauthorized user'
      })
    }

    if (!user.isActive()) {
      return res.status(StatusCodes.FORBIDDEN).send({
        success: false,
        message: 'Unauthorized user'
      })
    }

    next()
  }
