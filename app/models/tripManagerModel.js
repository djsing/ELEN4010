'use strict'

let db = require('./db')

function createTripQuery (trip, res) {
  let tripInfo = trip.body
  let queryString = `DELETE FROM trips WHERE id = ${tripInfo.id};`
  queryString = queryString + `INSERT INTO trips VALUES(
      '${tripInfo.id}',
      '${tripInfo.title}');`

  db.populateTripsTable(res, queryString)
}

module.exports = {
  createTripQuery: createTripQuery
}
