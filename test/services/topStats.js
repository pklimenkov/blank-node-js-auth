'use strict'
import '../../server/common/env'
import chai from 'chai'
import TweetsService from '../../server/services/tweetsService'

const expect = chai.expect
const tweetsService = new TweetsService('tw_gardaland')

describe('Tweets', () => {
  it('retrieve all tweets', async () => {
    const tweets = await tweetsService.all()
    expect(tweets.length).to.eq(5)
  })
})
