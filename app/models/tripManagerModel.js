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

function getTrips (req, res) {
  let user = JSON.parse(req.body.userHash)
  let queryString = `SELECT * FROM groups WHERE user_hash = '${user}';`

  db.pools
    .then(pool => {
      return pool.request()
        .query(queryString)
    })
    .then(result => {
      // console.log('get trips result ', result)
      if (result.recordset.length !== 0) {
        getTripTitles(result.recordset, res)
      }
    })
    .catch(err => {
      console.log('Get trips error:', err)
    })
}

function getTripTitles (trips, res) {
  db.pools
    .then(pool => {
      if (trips.length !== 0) {
        let queryString = `SELECT * FROM trips WHERE id IN (`
        for (let i = 0; i < trips.length; i++) {
          queryString = queryString + `'${trips[i].trip_id}',`
        }
        queryString = queryString.substring(0, queryString.length - 1)
        queryString = queryString + `);`

        return pool.request()
          .query(queryString)
      }
    })
    .then(result => {
      // console.log('get trip titles result ', result)
      if (trips.legnth !== 0) { res.send(result.recordset) } else {
        res.send('NoTripTitlesFound')
      }
    })
    .catch(err => {
      console.log('Get trip titles error:', err)
    })
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
  getTrips: getTrips,
  getDestinations: getDestinations
}
