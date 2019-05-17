'use strict'
jest.mock('../app/models/db')
let groupsModel = require('../app/models/groupsModel')

describe('testing groupMembersQueryString function', () => {
    let testMembersArray1 = []
    let testQS1 = `SELECT first_name, last_name, image_url FROM users WHERE hash IN );`
    test('group members query string is correct when no members exist', () => {
      expect(groupsModel.groupMembersQueryString(testMembersArray1)).toEqual(testQS1)
    })

    let testMember1 = {user_hash: 1234}
    let testMembersArray2 = [testMember1]
    let testQS2 = `SELECT first_name, last_name, image_url FROM users WHERE hash IN ('1234');`
    test('group members query string is correct when one member exists', () => {
      expect(groupsModel.groupMembersQueryString(testMembersArray2)).toEqual(testQS2)
    })

    let testMember2 = {user_hash: 5678}
    let testMembersArray3 = [testMember1, testMember2]
    let testQS3 = `SELECT first_name, last_name, image_url FROM users WHERE hash IN ('1234','5678');`
    test('group members query string is correct when two members exist', () => {
      expect(groupsModel.groupMembersQueryString(testMembersArray3)).toEqual(testQS3)
    })
})

describe('testing groupMembersQuery function', () => {
  
  let testMembersArray1 = []
  test('groupMembersQuery works when no members exist', async () => {
    let response = await groupsModel.groupMembersQuery(testMembersArray1)
    expect(response.recordset).toEqual(undefined)
  })

  let testMember1 = {user_hash: 1234}
  let testMembersArray2 = [testMember1]
  test('groupMembersQuery works when one member exists', async () => {
    let response = await groupsModel.groupMembersQuery(testMembersArray2)
    expect(response.recordset).toEqual(undefined)
  })

  let testMember2 = {user_hash: 5678}
  let testMembersArray3 = [testMember1, testMember2]
  test('groupMembersQuery works when two members exist', async () => {
    let response = await groupsModel.groupMembersQuery(testMembersArray3)
    expect(response.recordset).toEqual(undefined)
  })
})