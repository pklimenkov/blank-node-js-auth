'use strict'
import '../../server/common/env'
import chai from 'chai'
import HashtagsStatsService from '../../server/services/hashtagsStatsService'

const expect = chai.expect
const hashtagsStatsService = new HashtagsStatsService('tw_gardaland')

describe('Tweets', () => {
  it('retrieve all tweets', async () => {
    const tweets = await hashtagsStatsService.all()
    expect(tweets.length).to.eq(5)
  })
})
