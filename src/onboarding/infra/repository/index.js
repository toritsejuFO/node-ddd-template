const UserRepository = require('./user/userRepository')

module.exports = ({ database, logger }) => {
  const { User } = database

  return {
    userRepository: new UserRepository({ User, logger })
  }
}
