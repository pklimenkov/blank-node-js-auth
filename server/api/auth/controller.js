'use strict'
import AuthService from '../../services/authService'
import UsersService from '../../services/usersService'
import EmailService from '../../services/emailService'
import UserValidator from '../../validators/userValidator'
import i18n from '../../common/i18n'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import _ from 'lodash'

class Controller {
  /**
   * @api {post} /auth/login Login User
   * @apiName Login
   * @apiGroup Auth
   * @apiHeader {string} Content-Type application/json
   * @apiParamExample {json} Request-Example:
   * {
   *   "data": {
   *     "email": "info@vipemail.com",
   *     "password": "password"
   *   }
   * }
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true,
   *       "message": "Enjoy your token!",
   *       "token": "eyJhbGciOdsiJIUzI1NiIsInR"
   *       "refreshToken": "f819d430-8f52-4031-a84e-a128a528abc6"
   *     }
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "message": "Email or password invalid"
   *     }
  */
  async signupPost (req, res, next) {
    const errors = await UserValidator.onSignup(req)
    req.sanitize('email').normalizeEmail({
      remove_dots: false
    })
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        errors: errors.array()
      })
    }
    try {
      let data = _.pick(req.body, ['email', 'password', 'name', 'surname', 'role'])
      data.email = data.email.trim()
      let salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(data.password, salt)
      data.password = hash
      data.active = false
      let buf = await crypto.randomBytes(16)
      let token = buf.toString('hex')
      data.confirmationToken = token
      let user = await UsersService.create(data)
      if (user) {
        let activationEmail = await EmailService.activateAccount(req, data)
        if (!activationEmail) {
          return res.status(422).json({
            msg: 'Failed to send activation email.'
          })
        } else {
          return res.json({
            success: true,
            msg: 'Successfully sent activation email.'
          })
        }
      } else {
        return res.status(422).json({
          msg: 'Failed to save the user.'
        })
      }
    } catch (err) {
      return res.status(500).json([])
    }
  }

  async activateAccount (req, res) {
    try {
      // Find user by activation token
      let user = await UsersService.oneBy({ confirmationToken: req.body.token })
      // If not found return error
      if (!user) {
        return res.status(422).json({
          success: false,
          msg: 'Failed to activate account - No account found'
        })
      }
      if (user && user.active) {
        return res.json({
          success: true,
          msg: 'Account is already activated!'
        })
      }
      // If found set active property to true and return success message
      user.active = true
      let result = await UsersService.activate(user)
      if (result) {
        let activatedEmail = await EmailService.activated(result)
        if (!activatedEmail) {
          return res.json({
            success: false,
            msg: 'Failed to send activation notification email, but account is active!'
          })
        } else {
          return res.json({
            success: true,
            msg: 'Successfully activated account!'
          })
        }
      } else {
        return res.json({
          success: false,
          msg: 'Failed to activate account.'
        })
      }
    } catch (err) {
      return res.status(500).json([])
    }
  }

  async resendActivation (req, res) {
    const errors = await UserValidator.onResendActivation(req)
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array())
    }
    try {
      let inactiveUser = await UsersService.oneBy({ email: req.body.email })
      if (inactiveUser) {
        if (inactiveUser.active) {
          return res.json({
            success: true,
            msg: 'Your account is already activated!'
          })
        } else {
          let activationEmail = await EmailService.activateAccount(req, inactiveUser)
          if (!activationEmail) {
            return res.status(422).json({
              msg: 'Failed to resend activation email.'
            })
          } else {
            return res.json({
              success: true,
              msg: 'Successfully resent activation email.'
            })
          }
        }
      }
    } catch (err) {
      return res.status(500).json([])
    }
  }

  async login (req, res) {
    let tokens = await AuthService.login(req.body.data.email, req.body.data.password)
    if (tokens) {
      return res.json({
        success: true,
        message: 'Enjoy your tokens!',
        token: tokens.token,
        refreshToken: tokens.refreshToken
      })
    } else {
      return res.status(401).json({ message: 'Email or password invalid' })
    }
  }

  async forgotPost (req, res, next) {
    const errors = await UserValidator.onForgotPost(req)
    req.sanitize('email').normalizeEmail({
      remove_dots: false
    })
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        message: 'Please use a valid e-mail address!',
        errrors: errors.array()
      })
    }
    try {
      const buf = await crypto.randomBytes(16)
      const token = buf.toString('hex')
      let user = await UsersService.oneBy({ email: req.body.email })
      if (!user) {
        return res.json({
          success: false,
          msg: i18n.__('Address %s is not associated to any account', req.body.email)
        })
      }
      user.passwordResetToken = token
      user.passwordResetExpires = new Date(Date.now() + 3600000)
      await user.save()
      let forgotPasswordMail = await EmailService.forgotPasswordLink(req, user, token)
      if (forgotPasswordMail) {
        return res.json({
          success: true,
          msg: 'We sent You an email with link to change Your password.'
        })
      } else {
        return res.json({
          success: false,
          msg: 'Failed to send password modification link.'
        })
      }
    } catch (err) {
      return res.status(500).json([])
    }
  }

  async checkPasswordToken (req, res, next) {
    let data = _.pick(req.body, ['passwordResetToken'])
    let user = await UsersService.oneBy({ passwordResetToken: data.passwordResetToken })
    if (user) {
      let currentDate = new Date()
      let tokenExpDate = user.passwordResetExpires
      if (currentDate < tokenExpDate) {
        return res.json({
          success: true
        })
      } else {
        return res.json({
          success: false,
          msg: 'Password reset token expired.'
        })
      }
    } else {
      return res.json({
        success: false,
        msg: 'No user found with the reset token.'
      })
    }
  }

  async setPass (req, res, next) {
    let data = _.pick(req.body, ['password', 'passwordConfirmation', 'passwordResetToken'])
    console.log(data)
    const errors = await UserValidator.onSetPass(req)
    if (!errors.isEmpty()) {
      console.log('There were errors!')
      return res.json({
        success: false,
        message: 'Failed to update password',
        errors: errors.array()
      })
    }
    try {
      let user = await UsersService.oneBy({ passwordResetToken: data.passwordResetToken })
      console.log(user)
      if (user) {
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(data.password.trim(), salt)
        user.password = hash
        await user.save()
        let passwordChangedEmail = await EmailService.passwordChanged(user)
        if (passwordChangedEmail) {
          return res.json({
            success: true,
            msg: 'Successfully changed password!'
          })
        } else {
          return res.json({
            success: false,
            msg: 'Failed to send password changed email'
          })
        }
      } else {
        return res.json({
          success: false,
          msg: 'Failed to find user with the provided reset password token.'
        })
      }
    } catch (err) {
      return res.status(500).json([])
    }
  }

  /**
   * @api {post} /auth/refresh-token Refresh access token
   * @apiName Refresh access token
   * @apiGroup Auth
   * @apiHeader {string} Content-Type application/json
   * @apiParamExample {json} Request-Example:
   * {
   *   "data": {
   *     "email": "info@vipemail.com",
   *     "refreshToken": "8e2705ba-5897-4391-8c83-b82c12a6c2d6"
   *   }
   * }
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true,
   *       "message": "Enjoy your token!",
   *       "token": "eyJhbGciOdsiJIUzI1NiIsInR"
   *       "refreshToken": "afabbadc-3476-4c4b-b7f2-411a866d92ec"
   *     }
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "message": "Email or refresh token invalid"
   *     }
  */
  async refresh (req, res) {
    if (await AuthService.checkRefreshToken(req.body.data.email, req.body.data.refreshToken)) {
      let tokens = await AuthService.generateTokens(req.body.data.email, true)
      return res.json({
        success: true,
        message: 'Enjoy your tokens!',
        token: tokens.token,
        refreshToken: tokens.refreshToken
      })
    }
    return res.status(401).json({ message: 'Email or refresh token invalid' })
  }

  /**
   * @api {post} /auth/delete-refresh-token Delete refresh token
   * @apiName Delete refresh token
   * @apiGroup Auth
   * @apiHeader {string} Content-Type application/json
   * @apiParamExample {json} Request-Example:
   * {
   *   "data": {
   *     "email": "info@vipemail.com",
   *     "refreshToken": "8e2705ba-5897-4391-8c83-b82c12a6c2d6"
   *   }
   * }
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true,
   *       "message": "Refresh token deleted."
   *     }
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "message": "Email or refresh token invalid"
   *     }
  */
  async removeRefresh (req, res) {
    if (await AuthService.checkRefreshToken(req.body.data.email, req.body.data.refreshToken)) {
      await AuthService.deleteToken(req.body.data.email)
      return res.json({
        success: true,
        message: 'Refresh token deleted.'
      })
    }
    return res.status(401).json({ message: 'Email or refresh token invalid' })
  }

  /**
   * @api {get} /auth/check Check User JWT token
   * @apiName Check
   * @apiGroup Auth
   * @apiHeader {string} Content-Type application/json
   * @apiHeader {string} Bearer eyJhbGciOdsiJIUzI1NiIsInR
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true,
   *     }
   * @apiError HTTP/1.1 401 Unauthorized
  */
  async check (req, res) {
    return res.json({ success: true })
  }
}
export default new Controller()
