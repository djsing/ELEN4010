'use strict'

let db = require('./db')
let SqlString = require('sqlstring')

function lookUpUser (req, res) {
  let hash = req.body.hash
  // let queryString = `SELECT first_name, last_name FROM users WHERE hash = ${hash};`
  let queryString = SqlString.format('SELECT first_name, last_name FROM users WHERE hash = ?;', hash)
  db.getUserName(queryString, res)
}

module.exports = {
  lookUpUser: lookUpUser
}
