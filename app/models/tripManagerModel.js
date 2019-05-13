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
  let queryString = `SELECT * FROM groups WHERE user_hash = '${user}';`
  db.getTrips(queryString, res)
}

function getDestinations (req, res) {
  let tripId = req.body.tripId
  db.pools
    .then(pool => {
      let dbrequest = pool.request()
      dbrequest.input('tripId', tripId)
      return dbrequest
        .query(`SELECT * FROM destinations WHERE trip_id = @tripId;`)
    })
    .then(result => {
      // console.log('get destinations result ', result.recordset)
      res.send(result.recordset)
    })
    .catch(err => {
      console.log('Get destinations error:', err)
    })
}

module.exports = {
  populateTripAndGroupTableQuery: populateTripAndGroupTableQuery,
  getTripsQuery: getTripsQuery,
  getDestinations: getDestinations
}
