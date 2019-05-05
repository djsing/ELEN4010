'use strict'

let db = require('./db')

function populateTripAndGroupTableQuery (trip, res) {
  let tripInfo = trip.body
  let queryString = `DELETE FROM trips WHERE id = ${tripInfo.id};` +
  `INSERT INTO trips VALUES(
      '${tripInfo.id}',
      '${tripInfo.title}');` +
  `IF NOT EXISTS (SELECT * FROM groups
    WHERE user_hash = '${tripInfo.user}'
    AND trip_id = '${tripInfo.id}')
    BEGIN
      INSERT INTO groups VALUES(
      '${tripInfo.user}',
      '${tripInfo.id}')
    END;`

  db.populateTripsAndGroupsTable(res, queryString, tripInfo)
}

function getTripsQuery (req, res) {
  let user = JSON.parse(req.body.userHash)
  console.log('user string: ', user)
  let queryString = `SELECT * FROM groups WHERE user_hash = '${user}';`
  console.log('get trip titles QS: ', queryString)
  db.getTrips(queryString, res)
}

module.exports = {
  populateTripAndGroupTableQuery: populateTripAndGroupTableQuery,
  getTripsQuery: getTripsQuery
}
