'use strict'

let db = require('./db')

function returnGroupUsers (req, res) {
  let tripID = req.body.tripID
  let tripIDReturnUserQuery = `SELECT * FROM groups WHERE trip_id = '${tripID}';`
  db.fetchGroupMembers(tripIDReturnUserQuery, res)
}

module.exports = {
  returnGroupUsers: returnGroupUsers
}
