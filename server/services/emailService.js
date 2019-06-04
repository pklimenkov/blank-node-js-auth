'use strict'
import pug from 'pug'
import i18n from '../common/i18n'
import transporter from '../common/transporter'

class EmailService {
  async forgotPasswordLink (req, user, token) {
    let emailText = pug.renderFile('views/mailer/modify_password.pug', {
      host: process.env.FRONTEND_HOST,
      token: token,
      t: i18n.t
    })
    const mailOptions = {
      to: user.email,
      from: process.env.DEFAULT_EMAIL_FROM,
      subject: 'Forgotten password',
      html: emailText
    }
    let result = await transporter.sendMail(mailOptions)
    return result
  }

  async activateAccount (req, data) {
    let emailText = await pug.renderFile('views/mailer/confirm_account.pug', {
      host: process.env.FRONTEND_HOST,
      token: data.confirmationToken,
      t: i18n.t
    })
    const mailOptions = {
      to: data.email,
      from: process.env.DEFAULT_EMAIL_FROM,
      subject: 'Activate account',
      html: emailText
    }
    let result = await transporter.sendMail(mailOptions)
    return result
  }

  async activated (user) {
    let emailText = await pug.renderFile('views/mailer/account_activated.pug', {
      host: process.env.FRONTEND_HOST,
      account: user,
      t: i18n.t
    })
    const mailOptions = {
      to: user.email,
      from: process.env.DEFAULT_EMAIL_FROM,
      subject: 'Account activated',
      html: emailText
    }
    let result = await transporter.sendMail(mailOptions)
    return result
  }

  async passwordChanged (user) {
    let emailText = await pug.renderFile('views/mailer/password_changed.pug', {
      host: process.env.FRONTEND_HOST,
      account: user,
      t: i18n.t
    })
    const mailOptions = {
      to: user.email,
      from: process.env.DEFAULT_EMAIL_FROM,
      subject: 'Password changed',
      html: emailText
    }
    let result = await transporter.sendMail(mailOptions)
    return result
  }
}

export default new EmailService()
