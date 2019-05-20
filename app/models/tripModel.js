'use strict'

let db = require('./db')
let SqlString = require('sqlstring')

function createDestination (tripInfo, res) {
  let trip = tripInfo.body
  let queryString = createDestinationQueryString(trip)
  createDestinationQuery(queryString)
    .then(result => {
      // console.log('destination table population result ', result)
      res.send('DestinationTablePopulated')
    })
    .catch(err => {
      console.log('populate destination table error:', err)
    })
}

function createDestinationQueryString (trip) {
  let queryString = SqlString.format('DELETE FROM destinations WHERE trip_id = ?;', [trip.id])
  for (let i = 0; i < trip.destinationList.length; i++) {
    queryString = queryString + SqlString.format('INSERT INTO destinations VALUES (?,?,?,?,?,?,?,?);',
      [trip.destinationList[i].id,
        trip.destinationList[i].lat,
        trip.destinationList[i].lng,
        trip.destinationList[i].placeId,
        trip.destinationList[i].place,
        trip.destinationList[i].name,
        trip.destinationList[i].ordering,
        trip.id])
  }
  return queryString
}

function createDestinationQuery (queryString) {
  return db.pools
    .then(pool => {
      return pool.request()
        .query(queryString)
    })
}

module.exports = {
  createDestination: createDestination,
  createDestinationQueryString: createDestinationQueryString,
  createDestinationQuery: createDestinationQuery
}
