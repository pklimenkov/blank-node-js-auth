'use strict'
import localDatabase from '../common/localDatabase'

const schema = new localDatabase.Schema({
  permissions: {},
  name: String,
  surname: String,
  email: String,
  language: String,
  password: String,
  role: String,
  active: Boolean,
  confirmationToken: String,
  passwordConfirmation: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, { timestamps: true })

const User = localDatabase.model('User', schema, 'user')

export default User
