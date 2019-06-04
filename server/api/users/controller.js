'use strict'
import UsersService from '../../services/usersService'
import UserValidator from '../../validators/userValidator'
// var jwt = require('jsonwebtoken')
import jwt from 'jsonwebtoken'
import i18n from '../../common/i18n'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import _ from 'lodash'

class Controller {
  async byId (req, res) {
    let user = await UsersService.byId(req.params.id)
    if (user) res.json(user)
    else res.status(404).end()
  }

  async me (req, res) {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '')
    let userData = jwt.verify(token, process.env.JWT_SECRET)
    let user = await UsersService.oneBy({ email: userData.email })
    if (user) res.json(user)
    else res.status(404).end()
  }

  async updateMe (req, res) {
    let userData = _.pick(req.body, ['email', 'name', 'surname', 'role', 'language'])
    let userErrors = await UserValidator.onUpdate(req)
    let pwdErrors = await UserValidator.passwordCheck(req)
    if (!userErrors.isEmpty() || !pwdErrors.isEmpty()) {
      return res.json({
        success: false,
        userErrors: userErrors.array(),
        passwordErrors: pwdErrors.array()
      })
    }
    if (req.body.newPass) {
      let salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(req.body.newPass.password.trim(), salt)
      userData.password = hash
    }
    let result = await UsersService.update(req.body.currentEmail, userData)
    if (result) {
      return res.json({
        success: true,
        msg: 'Profile successfully updated!'
      })
    } else {
      return res.json({
        success: false,
        msg: 'Failed to update profile.'
      })
    }
  }
}
export default new Controller()
