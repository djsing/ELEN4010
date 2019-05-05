'use strict'

let db = require('./db')

function createDestinationQuery (trip, res) {
  let tripInfo = trip.body
  let queryString = `DELETE FROM destinations WHERE trip_id = ${tripInfo.id};`
  for (let i = 0; i < tripInfo.destinationList.length; i++) {
    queryString = queryString + `INSERT INTO destinations VALUES(
      '${tripInfo.destinationList[i].id}',
      '${tripInfo.destinationList[i].name}',
      '${tripInfo.destinationList[i].place}',
      '${tripInfo.destinationList[i].latLng}',
      '${tripInfo.destinationList[i].placeId}',
      '${tripInfo.destinationList[i].order}',
      '${tripInfo.id}');`
  }

  db.populateDestionationsTable(res, queryString)
}

function createLogQuery (logInfo, res) {
  let log = logInfo.body
  let logQueryString = ``
  for (let i = 0; i < log.length; i++) {
    logQueryString = logQueryString + `INSERT INTO log VALUES(
      '${log[i].id}',
      '${log[i].who}',
      '${log[i].what}',
      '${log[i].when}',
      '${log[i].importance}',
      '${log[i].tripId}',);`
  }

  db.populateLogTable(res, logQueryString)
}

module.exports = {
  createDestinationQuery: createDestinationQuery,
  createLogQuery: createLogQuery
}
