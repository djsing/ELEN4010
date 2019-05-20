'use strict'
jest.mock('../app/models/db')
let groupsModel = require('../app/models/groupsModel')

describe('testing groupMembersQueryString function', () => {
  let testMembersArray1 = []
  let testQS1 = `SELECT first_name, last_name, image_url FROM users WHERE hash IN );`
  test('group members query string is correct when no members exist', () => {
    expect(groupsModel.groupMembersQueryString(testMembersArray1)).toEqual(testQS1)
  })

  let testMember1 = { user_hash: 1234 }
  let testMembersArray2 = [testMember1]
  let testQS2 = `SELECT first_name, last_name, image_url FROM users WHERE hash IN ('1234');`
  test('group members query string is correct when one member exists', () => {
    expect(groupsModel.groupMembersQueryString(testMembersArray2)).toEqual(testQS2)
  })

  let testMember2 = { user_hash: 5678 }
  let testMembersArray3 = [testMember1, testMember2]
  let testQS3 = `SELECT first_name, last_name, image_url FROM users WHERE hash IN ('1234','5678');`
  test('group members query string is correct when two members exist', () => {
    expect(groupsModel.groupMembersQueryString(testMembersArray3)).toEqual(testQS3)
  })
})

describe('testing groupModel query functions', () => {
  test('testing groupQuery with single trip ID and one member', async () => {
    let tripID = 0
    let group = await groupsModel.groupQuery(tripID)
    expect(group.recordset.length).toEqual(1)
    expect(group.recordset[0].user_hash).toEqual('a1b2c3d4e5f6g7h8i9')
    expect(group.recordset[0].trip_id).toEqual('123456789')
  })

  test('testing groupQuery with single trip ID and multiple members', async () => {
    let tripID = 1
    let group = await groupsModel.groupQuery(tripID)
    expect(group.recordset.length).toEqual(2)
    expect(group.recordset[0].user_hash).toEqual('a1b2c3d4e5f6g7h8i9')
    expect(group.recordset[0].trip_id).toEqual('123456789')
    expect(group.recordset[1].user_hash).toEqual('q1w2e3r4t5y6u7i8o9')
    expect(group.recordset[1].trip_id).toEqual('987654321')
  })

  test('testing groupMembersQuery with single trip ID and multiple members', async () => {
    let group = [{
      user_hash: 'a1b2c3d4e5f6g7h8i9',
      trip_id: '123456789'
    }, {
      user_hash: 'q1w2e3r4t5y6u7i8o9',
      trip_id: '987654321'
    }]
    let members = await groupsModel.groupMembersQuery(group)
    expect(members.recordset.length).toEqual(2)
    expect(members.recordset[0].first_name).toEqual('Darrion')
    expect(members.recordset[0].last_name).toEqual('Singh')
    expect(members.recordset[0].image_url).toEqual('http://googleusers.com/darrionimage.jpg')

    expect(members.recordset[1].first_name).toEqual('Tyson')
    expect(members.recordset[1].last_name).toEqual('Cross')
    expect(members.recordset[1].image_url).toEqual(null)
  })
})