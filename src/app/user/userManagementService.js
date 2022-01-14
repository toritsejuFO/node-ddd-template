class UserManagementService {
  constructor({ repository: { userRepository }, eventEmitter, EVENTS }) {
    this.userRepository = userRepository
    this.eventEmitter = eventEmitter
    this.EVENTS = EVENTS
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll()
    this.eventEmitter.emitEvent(this.EVENTS.FETCHED_ALL_USERS, {
      userCount: users.length
    })
    return users
  }
}

module.exports = UserManagementService
