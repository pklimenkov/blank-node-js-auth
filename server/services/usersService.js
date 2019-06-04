'use strict'
import User from '../models/user'

class UsersService {
  async byId (id) {
    let user = await User.findById(id).exec()
    return user
  }

  async oneBy (q) {
    let user = await User.findOne(q).exec()
    return user
  }

  async all () {
    let users = await User.find({}).sort({ email: 'asc' }).exec()
    return users
  }

  async create (data) {
    let user = new User(data)
    await user.save()
    return user
  }

  async update (currentEmail, userData) {
    let result = await User.findOneAndUpdate({ email: currentEmail }, userData, { new: true })
    console.log(result)
    return result
  }

  async activate (user) {
    let result = User.findOneAndUpdate({ confirmationToken: user.confirmationToken, email: user.email, active: false }, user, { new: true })
    return result
  }
}

export default new UsersService()
