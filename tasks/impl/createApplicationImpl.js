'use strict'
import ApplicationsService from '../../server/services/applicationsService'

const generateApplication = async () => {
  await ApplicationsService.create({ name: 'smafix', ip: '127.0.0.1' })
}

generateApplication().then(() => process.exit())
