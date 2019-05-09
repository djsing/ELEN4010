'use strict'

let db = require('./db')

function populateTripAndGroupTableQuery (trip, res) {
  let tripInfo = trip.body
  let queryString = `DELETE FROM trips WHERE id = ${tripInfo.id};` +
  `INSERT INTO trips VALUES(
      '${tripInfo.id}',
      '${tripInfo.title}');` +
  `IF NOT EXISTS (SELECT * FROM groups
    WHERE hash = '${tripInfo.user}'
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
  let queryString = `SELECT * FROM groups WHERE hash = '${user}';`
  db.getTrips(queryString, res)
}

function getDestinationsQuery (req, res) {
  let tripId = req.body.tripId
  let queryString = `SELECT * FROM destinations WHERE trip_id = '${tripId}';`
  db.getDestinations(queryString, res)
}

module.exports = {
  populateTripAndGroupTableQuery: populateTripAndGroupTableQuery,
  getTripsQuery: getTripsQuery,
  getDestinationsQuery: getDestinationsQuery
}
