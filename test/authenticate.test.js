jest.mock('../app/models/db')
let authenticate = require('../app/models/authenticate')
const crypto = require('crypto')

describe('testing authentication', () => {
  let userInfo = {
    emailAddress: 'test@gmail.com',
    password: '12345678',
    userID: 12345678
  }

  const userHash = crypto.createHash('sha256')
  userHash.update(userInfo.emailAddress + userInfo.password)
  let userHashKey = userHash.digest('hex')

  const googleUserHash = crypto.createHash('sha256')
  googleUserHash.update(userInfo.userID + userInfo.password)
  let googleUserHashKey = googleUserHash.digest('hex')

  test('correct user hash key generated', () => {
    let user = authenticate.createHashKey(userInfo, false)
    expect(user.hash).toEqual(userHashKey)
  })

  test('correct google user hash key generated', () => {
    let googleUser = authenticate.createHashKey(userInfo, true)
    expect(googleUser.hash).toEqual(googleUserHashKey)
  })
})