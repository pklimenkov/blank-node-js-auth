'use strict'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import l from './logger'

const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

passport.use('jwt', new JwtStrategy(opts, async (jwtPayload, done) => {
  l.info('PASSPORT')
  console.log(jwtPayload)
  console.log(await opts.jwtFromRequest)

  return done(null, jwtPayload)
}))
