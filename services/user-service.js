const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const TokenService = require('./token-service')
const tokenService = require('./token-service')

class UserService {
  async regitration(email, password) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw new Error(`User with this email exist`)
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink
    })
    await mailService.sendActivationMail(email, activationLink)
    const tokens = tokenService.generateToken()
  }
}

module.exports = new UserService()
