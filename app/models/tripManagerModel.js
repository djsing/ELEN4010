'use strict'

let db = require('./db')

/* Populate trip and groups table */
function populateTripAndGroupTable (trip, res) {
  let tripInfo = trip.body
  populateTripAndGroupTableQuery(tripInfo)
    .then(result => {
      // console.log('trips and groups population result ', result)
      res.send(tripInfo)
    })
    .catch(err => {
      console.log('populate trips table error:', err)
    })
}

function populateTripAndGroupTableQuery (tripInfo) {
  return db.pools
    .then(pool => {
      let dbrequest = pool.request()
      dbrequest.input('id', db.sql.Char, tripInfo.id)
      dbrequest.input('title', tripInfo.title)
      dbrequest.input('user', tripInfo.user)

      return dbrequest
        .query(`DELETE FROM trips WHERE id = @id; INSERT INTO trips VALUES(@id, @title); IF NOT EXISTS (SELECT * FROM groups WHERE user_hash = @user AND trip_id = @id) BEGIN INSERT INTO groups VALUES(@user, @id) END;`)
    })
}

/* Get Trips Query */

function getTrips (req, res) {
  let user = JSON.parse(req.body.userHash)
  getTripsQuery(user)
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

function getTripsQuery (user) {
  return db.pools
    .then(pool => {
      let dbrequest = pool.request()
      dbrequest.input('user', user)
      return dbrequest
        .query(`SELECT * FROM groups WHERE user_hash = @user;`)
    })
}

function getTripTitles (trips, res) {
  getTripTitlesQuery(trips)
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

function getTripTitlesQuery (trips) {
  return db.pools
    .then(pool => {
      if (trips.length !== 0) {
        let queryString = getTripTitlesQueryString(trips)
        return pool.request()
          .query(queryString)
      }
    })
}

function getTripTitlesQueryString (trips) {
  let queryString = `SELECT * FROM trips WHERE id IN (`
  for (let i = 0; i < trips.length; i++) {
    queryString = queryString + `'${trips[i].trip_id}',`
  }
  queryString = queryString.substring(0, queryString.length - 1)
  queryString = queryString + `);`
  return queryString
}

/* Get Destinations Query */

function getDestinations (req, res) {
  let tripId = req.body.tripId
  getDestinationsQuery(tripId)
    .then(result => {
      // console.log('get destinations result ', result.recordset)
      res.send(result.recordset)
    })
    .catch(err => {
      console.log('Get destinations error:', err)
    })
}

function getDestinationsQuery (tripId) {
  return db.pools
    .then(pool => {
      let dbrequest = pool.request()
      dbrequest.input('tripId', tripId)
      return dbrequest
        .query(`SELECT * FROM destinations WHERE trip_id = @tripId;`)
    })
}

module.exports = {
  populateTripAndGroupTable: populateTripAndGroupTable,
  getTrips: getTrips,
  getDestinations: getDestinations,
  getTripTitlesQueryString: getTripTitlesQueryString,
  populateTripAndGroupTableQuery: populateTripAndGroupTableQuery,
  getTripsQuery: getTripsQuery,
  getTripTitlesQuery: getTripTitlesQuery,
  getDestinationsQuery: getDestinationsQuery
}
