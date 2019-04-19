'use strict'

let express = require('express')
let mainRouter = express.Router()
let db = require('../models/db.js')

mainRouter.get('/', function (req, res) {
  res.sendFile('/index.html', { root: req.app.get('views') })
})

mainRouter.get('/about', function (req, res) {
  res.sendFile('/about.html', { root: req.app.get('views') })
})

mainRouter.get('/database', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // This is only a test query, change it to whatever you need
        .query('SELECT 1')
    })
    // Send back the result
    .then(result => {
      res.status(200).send(result)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.status(500).send(err)
    })
})

mainRouter.get('/sign-in/', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'sign-in.html'))
})

mainRouter.get('*', function (req, res) {
  res.status(404).send('404 Error: page not found')
})

module.exports = mainRouter
