'use strict'

let db = require('./db')

function addInvite (res, invite) {
  db.addToInvitesTable(res, invite.tripID, invite.emailAddress)
}

function getInvites (res, emailAddress) {
  let queryString = `SELECT trip_id FROM invites WHERE email_address = '${emailAddress}'`
  console.log('getInvites QS', queryString)
  db.getInvites(res, queryString)
}

function handleInvites (req, res, accept) {
  let trip_id = req.body.id
  let trip_title = req.body.title
  let user = req.body.user
  let queryStringDelete = `DELETE FROM invites WHERE trip_id = ${trip_id};`

  let queryStringAdd = `DELETE FROM trips WHERE id = ${trip_id};` +
  `INSERT INTO trips VALUES(
      '${trip_id}',
      '${trip_title}');` +
  `IF NOT EXISTS (SELECT * FROM groups
    WHERE user_hash = '${user}'
    AND trip_id = '${trip_id}')
    BEGIN
      INSERT INTO groups VALUES(
      '${user}',
      '${trip_id}')
    END;`

  db.handleInvites(queryStringDelete, queryStringAdd, accept, res)
}

module.exports = {
  addInvite: addInvite,
  getInvites: getInvites,
  handleInvites: handleInvites
}
