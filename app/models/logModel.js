'use strict'

let db = require('./db')
let SqlString = require('sqlstring')

function createLogQuery (logInfo, res) {
  let log = logInfo.body
  let queryString = ''
  for (let i = 0; i < log.length; i++) {
    queryString = queryString + SqlString.format('INSERT INTO log VALUES (?,?,?,?,?,?);',
      [log[i].id,
        log[i].userId,
        log[i].code,
        log[i].date,
        log[i].importance,
        log[i].tripId])
  }

  db.populateLogTable(res, queryString)
}

function getLogsQuery (req, res) {
  let tripId = req.body.tripId
  let queryString = SqlString.format('SELECT * FROM log WHERE trip_id = ? ;', [tripId])
  db.getLogs(queryString, res)
}

module.exports = {
  createLogQuery: createLogQuery,
  getLogsQuery: getLogsQuery
}
