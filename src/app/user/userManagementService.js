class UserManagementService {
  constructor({ repository: { userRepository } }) {
    this.userRepository = userRepository
  }

  async getAllUsers() {
    return await this.userRepository.findAll()
  }
}

module.exports = UserManagementService
