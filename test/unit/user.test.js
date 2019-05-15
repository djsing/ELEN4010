jest.mock('../../app/models/db')
let userModel = require('../../app/models/userModel')

describe('testing userModel', () => {
  let userInfo = {
    firstName: 'Some',
    lastName: 'Person',
    emailAddress: 'test@gmail.com',
    password: '12345678',
    userID: 12345678,
    image: 'http://some.url.com/image.jpg',
    hash: 'a1b2c3d4e5f6g7h8i9',
    userType: 'incorrectUser'
  }

  test('test that user information gets deleted in fail to sign-in/register server responses', () => {
    let expectServerInfoResponse = { userType: 'incorrectUser' }
    let testInfo = userInfo
    userModel.deleteUnnecessaryInfo(testInfo)
    expect(testInfo).toEqual(expectServerInfoResponse)
  })
})