const UserRepository = require('./user/userRepository')

module.exports = ({ database }) => {
  const { User } = database

  return {
    userRepository: new UserRepository({ User })
  }
}
