'use strict'
jest.mock('../app/models/db')
let invitesModel = require('../app/models/invitesModel')

describe('testing the addInvite query functions', () => {
  let invite = {
    tripID: '123456',
    emailAddress: 'test@test.com'
  }
  test('testing addInviteQuery', async () => {
    let checkInvite = await invitesModel.addInviteQuery(invite)
    expect(checkInvite.recordset[0].trip_id).toEqual('123456')
    expect(checkInvite.recordset[0].email_address).toEqual('test@test.com')
  })

  test('testing addInviteToInviteTable', async () => {
    let addInvite = await invitesModel.addInviteToInviteTable(invite)
    expect(Object.keys(addInvite).length).toEqual(1)
    expect(addInvite.recordset).toEqual(undefined)
  })
})

describe('testing the getInvites query functions', () => {
  test('testing getTripInvitesForSpecificUserQuery', async () => {
    let email = 'test@test.com'
    let tripInvite = await invitesModel.getTripInvitesForSpecificUserQuery(email)
    expect(tripInvite.recordset[0]).toEqual({ trip_id: '123456' })
  })
})