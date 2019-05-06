'use strict'

let db = require('./db')
let SqlString = require('sqlstring')

function createDestinationQuery (tripInfo, res) {
  let trip = tripInfo.body
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
  db.populateDestionationsTable(res, queryString)
}

module.exports = {
  createDestinationQuery: createDestinationQuery,
}
