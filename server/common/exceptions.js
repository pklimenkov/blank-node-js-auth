'use strict'
import airbrake from 'airbrake'
import l from './logger'
import { formatErrors } from './helpers'

class App404Error extends Error {
  constructor (message, status) {
    // Calling parent constructor of base Error class.
    super(message)

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor)

    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.status = status || 404
  }
}

class App500Error extends Error {
  constructor (message, status) {
    // Calling parent constructor of base Error class.
    super(message)

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor)

    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.status = status || 500
  }
}

const airbrakeClient = airbrake.createClient(
  process.env.AIRBRAKE_PROJECT_ID,
  process.env.AIRBRAKE_PROJECT_KEY
)

const notifyException = async (req, error) => {
  l.error(req)
  l.error(error)
  if (process.env.APP_ENV !== 'development') {
    await airbrakeClient.notify(error)
  }
}

const handleException = (req, res, error) => {
  notifyException(req, error)
  res.status(500).json(formatErrors(error))
}

const wrap = fn => (...args) => fn(...args).catch((e) => {
  handleException(args[0], args[1], e)
})

export { App404Error, App500Error, handleException, notifyException, wrap }
