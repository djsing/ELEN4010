'use strict'

let db = require('./db')

function createDestinationQuery (trip, res) {
  let tripInfo = trip.body
  let queryString = `DELETE FROM destinations WHERE trip_id = ${tripInfo.id};`
  for (let i = 0; i < tripInfo.destinationList.length; i++) {
    queryString = queryString + `INSERT INTO destinations VALUES(
      '${tripInfo.destinationList[i].id}',
      '${tripInfo.destinationList[i].lat}',
      '${tripInfo.destinationList[i].lng}',
      '${tripInfo.destinationList[i].placeId}',
      '${tripInfo.destinationList[i].place}',
      '${tripInfo.destinationList[i].name}',
      '${tripInfo.destinationList[i].ordering}',
      '${tripInfo.id}');`
  }
  db.populateDestionationsTable(res, queryString)
}

module.exports = {
  createDestinationQuery: createDestinationQuery
}
