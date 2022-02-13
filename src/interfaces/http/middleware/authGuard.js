const {
  StatusCodes: { FORBIDDEN }
} = require('http-status-codes')

module.exports =
  ({ jwtService, repository: { userRepository } }) =>
  async (req, res, next) => {
    const token = req.get('X-Auth-Token')
    let email, userId

    if (!token) {
      return res
        .status(FORBIDDEN)
        .send({ success: false, message: 'X-Auth-Token header is required' })
    }

    try {
      const decodedPayload = jwtService.verify(token)
      ;({ email, userId } = decodedPayload)
    } catch (error) {
      return res.status(FORBIDDEN).send({
        success: false,
        message: 'Could not validate X-Auth-Token',
        error: error.message
      })
    }

    const user = await userRepository.findOneBy({ email, userId })
    req.user = user
    next()
  }
