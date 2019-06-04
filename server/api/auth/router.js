'use strict'
import * as express from 'express'
import passport from 'passport'
import controller from './controller'
import { wrap } from '../../common/exceptions'

export default express
  .Router()
  .post('/login', wrap(controller.login))
  .post('/refresh-token', wrap(controller.refresh))
  .post('/delete-refresh-token', wrap(controller.removeRefresh))
  .post('/signup', wrap(controller.signupPost))
  .post('/send-activation-link', wrap(controller.resendActivation))
  .post('/activate', wrap(controller.activateAccount))
  .post('/send-forgot-password-link', wrap(controller.forgotPost))
  .post('/check-password-token', wrap(controller.checkPasswordToken))
  .post('/set-password', wrap(controller.setPass))
  .get('/check', passport.authenticate('jwt', { session: false }), wrap(controller.check))
