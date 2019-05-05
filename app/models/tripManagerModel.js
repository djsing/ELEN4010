'use strict'

let db = require('./db')

function populateTripTableQuery (trip, res) {
  let tripInfo = trip.body
  let queryString = `DELETE FROM trips WHERE id = ${tripInfo.id};`
  queryString = queryString + `INSERT INTO trips VALUES(
      '${tripInfo.id}',
      '${tripInfo.title}');`

  db.populateTripsTable(res, queryString)
}

function getTripsQuery (req, res) {
  let user = req.body.userHash
  let queryString = `SELECT * FROM groups WHERE user_hash = ${user};`
  console.log('get trip titles QS: ', queryString)
  db.getTrips(queryString, res)
}

module.exports = {
  populateTripTableQuery: populateTripTableQuery,
  getTripsQuery: getTripsQuery
}
