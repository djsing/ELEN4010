'use strict'

let db = require('./db')

function addInvite (res, invite) {
  db.addToInvitesTable(res, invite.tripID, invite.emailAddress)
}

function getInvites (res, emailAddress) {
  let queryString = `SELECT trip_id FROM invites WHERE email_address = '${emailAddress}'`
  db.getInvites(res, queryString)
}

function handleInvites (req, res, accept) {
  let triID = req.body.id
  let trip_title = req.body.title
  let user = req.body.user
  let queryStringDelete = `DELETE FROM invites WHERE trip_id = ${triID};`

  let queryStringAdd = `DELETE FROM trips WHERE id = ${triID};` +
  `INSERT INTO trips VALUES(
      '${triID}',
      '${trip_title}');` +
  `IF NOT EXISTS (SELECT * FROM groups
    WHERE user_hash = '${user}'
    AND trip_id = '${triID}')
    BEGIN
      INSERT INTO groups VALUES(
      '${user}',
      '${triID}')
    END;`

  console.log(queryStringDelete)
  db.handleInvites(queryStringDelete, queryStringAdd, accept, res)
}

module.exports = {
  addInvite: addInvite,
  getInvites: getInvites,
  handleInvites: handleInvites
}
