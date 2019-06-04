'use strict'
import passport from 'passport'

// API ROUTES
import authRouter from './api/auth/router'
import usersRouter from './api/users/router'

// APP ROUTES

export default function routes (app) {
  // API ROUTES
  app.use('/external/api/v1/auth', authRouter)
  app.use('/external/api/v1/users', passport.authenticate('jwt', { session: false }), usersRouter)
}
