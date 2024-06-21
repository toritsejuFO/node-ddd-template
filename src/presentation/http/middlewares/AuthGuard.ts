import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import UserRepository from '@/app/repositories/UserRepository.interface'
import JwtService from '@/app/services/api/JwtService.interface'

export default (jwtService: JwtService, userRepository: UserRepository) =>
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
      req.user = user
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
