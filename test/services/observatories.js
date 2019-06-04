'use strict'
import '../../server/common/env'
import chai from 'chai'
import ObservatoriesService from '../../server/services/observatoriesService'
import mongodb from 'mongodb'

const expect = chai.expect
const observatoriesService = new ObservatoriesService()

describe('Observatories', () => {
  it('retrieve all obeervatories', async () => {
    const observatories = await observatoriesService.all()
    expect(observatories.length).to.eq(10)
  })

  it('retrieve an observatory by its id', async () => {
    const observatory = await observatoriesService.byId('59ba2cb0313261d10afccf83')
    expect(observatory._id).to.eql(mongodb.ObjectId('59ba2cb0313261d10afccf83'))
  })

  it('retrieve a list of observatory by an array of ids', async () => {
    const observatories = await observatoriesService.byIds(['59ba2cb0313261d10afccf83', '5964a0fa3132612754c5072d'])
    expect(observatories.length).to.eq(2)
  })

  it('retrieve a list of observatory by category', async () => {
    const observatories = await observatoriesService.category(0, 20, 'natura')
    expect(observatories.length).to.eq(3)
  })

  it.only('retrieve a list of suggested observatory from given ids', async () => {
    const observatories = await observatoriesService.suggestedByIds(['59ba2cb0313261d10afccf83', '5964a0fa3132612754c5072d'])
    expect(observatories.length).to.eq(8)
  })
})
