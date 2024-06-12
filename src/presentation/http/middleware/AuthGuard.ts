import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import UserRepository from '../../../domain/repository/UserRepository.interface'

export default (jwtService: any, userRepository: UserRepository) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.get('X-Auth-Token')
    let email, userId

    if (!token) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .send({ success: false, message: 'X-Auth-Token header is required' })
    }

    try {
      const decodedPayload = jwtService.verify(token)
      ;({ email, userId } = decodedPayload)
    } catch (error: any) {
      return res.status(StatusCodes.FORBIDDEN).send({
        success: false,
        message: 'Could not validate X-Auth-Token',
        error: error.message
      })
    }

    const user = await userRepository.findOneBy({ email, userId })
    req.user = user
    next()
  }
