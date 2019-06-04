'use strict'
import i18n from '../common/i18n'
import UsersService from '../services/usersService'

class UserValidator {
  async onLogin (req) {
    req.check('data.email').trim().notEmpty().isEmail()
    req.check('data.password').trim().notEmpty()
    const errors = await req.getValidationResult()
    return errors
  }

  async onSignup (req) {
    req.check('email', i18n.__('errors.messages.invalid')).isEmail()
    req.check('email', i18n.__('errors.messages.blank')).notEmpty()
    req.check('name', i18n.__('errors.messages.blank')).notEmpty()
    req.check('email', i18n.__('errors.messages.fb_email_already_associated')).custom(async email => {
      let emailExists = await UsersService.oneBy({ email: email })
      if (emailExists) {
        throw new Error('errors.messages.fb_email_already_associated')
      }
    })
    req.check('surname', i18n.__('errors.messages.blank')).notEmpty()
    req.check('role', i18n.__('errors.messages.blank')).equals('user')
    req.check('password', i18n.__('errors.messages.password_error')).len(8)
    const errors = await req.getValidationResult()
    return errors
  }

  async onForgotPost (req) {
    req.check('email', i18n.__('errors.messages.invalid')).isEmail()
    req.check('email', i18n.__('errors.messages.blank')).notEmpty()
    const errors = await req.getValidationResult()
    return errors
  }

  async onSetPass (req) {
    req.check('password').trim().notEmpty()
    req.check('password', i18n.__('errors.messages.password_error')).len(8)
    req.check('password', i18n.__('errors.messages.must_match')).equals(req.body.passwordConfirmation.trim())
    const errors = await req.getValidationResult()
    return errors
  }

  async onResendActivation (req) {
    req.check('email', i18n.__('errors.messages.invalid')).isEmail()
    req.check('email', i18n.__('errors.messages.blank')).notEmpty()
    const errors = await req.getValidationResult()
    return errors
  }

  async onUpdate (req) {
    req.check('email', i18n.__('errors.messages.invalid')).isEmail()
    req.check('email', i18n.__('errors.messages.blank')).notEmpty()
    req.check('name', i18n.__('errors.messages.blank')).notEmpty()
    if (req.body.email !== req.body.currentEmail) {
      req.check('email', i18n.__('errors.messages.fb_email_already_associated')).custom(async email => {
        let emailExists = await UsersService.oneBy({ email: email })
        if (emailExists) {
          throw new Error(i18n.__('errors.messages.fb_email_already_associated'))
        }
      })
    }
    req.check('surname', i18n.__('errors.messages.blank')).notEmpty()
    req.check('role', 'must be user').equals('user')
    const errors = await req.getValidationResult()
    return errors
  }

  async passwordCheck (req) {
    if (req.body.newPass) {
      req.check('newPass.password').trim().notEmpty()
      req.check('newPass.password', i18n.__('errors.messages.password_error')).len(8)
      req.check('newPass.password', i18n.__('errors.messages.must_match')).equals(req.body.newPass.confirmPassword.trim())
    }
    const errors = await req.getValidationResult()
    return errors
  }
}

export default new UserValidator()
