'use strict'
import User from '../models/user'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { redisResetTokens } from '../common/redisInstances'
import uuidv4 from 'uuid/v4'

class AuthService {
  async login (email, password) {
    let user = await User.findOne({ email: email, active: true }).exec()
    const authenticated = await bcrypt.compare(password, user.password)
    if (authenticated) {
      return this.generateTokens(user.email)
    }
  }

  async generateTokens (email, force) {
    let user = await User.findOne({ email: email, active: true }).exec()
    let payload = { email: user.email }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
    let refreshToken = await redisResetTokens.getAsync(`refresh-token:${email}`)
    if (!refreshToken || force) {
      // refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE })
      refreshToken = uuidv4()
      await redisResetTokens.setAsync(`refresh-token:${email}`, refreshToken)
    }
    return { token: token, refreshToken: refreshToken }
  }

  async checkRefreshToken (email, refreshToken) {
    let storedRefreshToken = await redisResetTokens.getAsync(`refresh-token:${email}`)
    return (storedRefreshToken && storedRefreshToken === refreshToken)
  }

  async deleteToken (email, refreshToken) {
    await redisResetTokens.delAsync(`refresh-token:${email}`)
  }
}

export default new AuthService()
