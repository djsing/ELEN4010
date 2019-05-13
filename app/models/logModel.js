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

function getLogs (req, res) {
  let tripId = req.body.tripId
  db.pools
    .then(pool => {
      let dbrequest = pool.request()
      dbrequest.input('tripId', tripId)
      return dbrequest
        .query(`SELECT id, userId, code, date, importance, trip_id, first_name, last_name
        FROM log
        JOIN users
        ON log.userid = users.hash
        WHERE trip_id = @tripId;`)
    })
    .then(result => {
      res.send(result.recordset)
    })
    .catch(err => {
      console.log('Get log error:', err)
    })
}

module.exports = {
  createLogQuery: createLogQuery,
  getLogs: getLogs
}
