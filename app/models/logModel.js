'use strict'

let db = require('./db')
let SqlString = require('sqlstring')

function createLog (logInfo, res) {
  let log = logInfo.body
  let queryString = createLogQueryString(log)
  createLogQuery(queryString)
    .then(result => {
      res.send('Log table added to entries')
    })
    .catch(err => {
      console.log('populate log table error:', err)
    })
}

function createLogQueryString (log) {
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
  return queryString
}

function createLogQuery (queryString) {
  return db.pools
    .then(pool => {
      return pool.request()
        .query(queryString)
    })
}

function getLogs (req, res) {
  let tripId = req.body.tripId
  getLogQuery(tripId)
    .then(result => {
      res.send(result.recordset)
    })
    .catch(err => {
      console.log('Get log error:', err)
    })
}

function getLogQuery (tripId) {
  return db.pools
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
}

module.exports = {
  createLog: createLog,
  getLogs: getLogs,
  createLogQueryString: createLogQueryString
}