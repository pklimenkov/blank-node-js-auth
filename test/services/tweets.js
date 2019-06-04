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

  it('retrieve realtime tweets', async () => {
    const tweets = await tweetsService.realtime()
    expect(tweets.length).to.eq(20)
  })

  it('retrieve timeline tweets', async () => {
    const tweets = await tweetsService.timeline('2017-07-01', '2017-08-31')
    expect(tweets.length).to.eq(52)
  })

  it('retrieve timeline by tag tweets', async () => {
    const tweets = await tweetsService.timelineByTag('2017-07-01', '2017-08-31', 'gardaland')
    expect(tweets.length).to.eq(52)
  })

  it('retrieve keywords popularity', async () => {
    const tweets = await tweetsService.keywordsPopularity('2017-07-01', '2017-08-31')
    expect(tweets.length).to.eq(7)
  })

  it('retrieve top users', async () => {
    const topUsers = await tweetsService.topUsers('2017-07-01', '2017-08-31')
    expect(topUsers.length).to.eq(15)
  })

  // it('retrieve top mentions', async () => {
  //   const topMentions = await tweetsService.topMentions('2017-07-01', '2017-08-31')
  //   expect(topMentions.length).to.eq(15)
  // })

  it('retrieve day details', async () => {
    const day = new Date('2017-07-11')
    const dayDetails = await tweetsService.dayDetails(day)
    expect(dayDetails[0]._id).to.eql(day)
  })

  it('retrieve tweets by userId', async () => {
    const day = new Date('2017-07-01')
    const tweets = await tweetsService.tweetsByUser('548662286', day)
    expect(tweets.length).to.eql(5)
  })

  it('retrieve tweets by hashtag', async () => {
    const day = new Date('2017-07-01')
    const tweets = await tweetsService.tweetsByHashtag('music', day)
    expect(tweets.length).to.eql(5)
  })

  it('retrieve users by hashtag', async () => {
    const day = new Date('2017-07-01')
    const users = await tweetsService.usersByHashtag('music', day)
    expect(users.length).to.eql(5)
  })

  it.only('retrieve hashtag cloud', async () => {
    const details = await tweetsService.hashtagsDetailsCloud('2017-07-01', '2017-08-31')
    expect(details.length).to.eql(60)
  })
})
