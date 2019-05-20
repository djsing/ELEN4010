jest.mock('../app/models/db')
let userModel = require('../app/models/userModel')

describe('testing userModel', () => {
  test('test that user information gets deleted in fail to sign-in/register server responses', () => {
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
    let expectServerInfoResponse = { userType: 'incorrectUser' }
    userModel.deleteUnnecessaryInfo(userInfo)
    expect(userInfo).toEqual(expectServerInfoResponse)
  })

  test('test findUserQuery', async () => {
    let email = 'test@test.com'
    let user = await userModel.findUserQuery(email)
    expect(user.recordset[0].first_name).toEqual('Some')
    expect(user.recordset[0].last_name).toEqual('Person')
    expect(user.recordset[0].email_address).toEqual('test@test.com')
    expect(user.recordset[0].image_url).toEqual('http://image.com/image.jpg')
    expect(user.recordset[0].hash).toEqual('q1w2e3r4t5y6u7i8o9')
  })

  test('test createUserQuery', async () => {
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
    let createUser = await userModel.createUserQuery(userInfo)
    expect(Object.keys(createUser).length).toEqual(1)
    expect(createUser.recordset).toEqual(undefined)
  })
})