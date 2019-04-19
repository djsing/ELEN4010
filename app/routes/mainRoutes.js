'use strict'

let path = require('path')
let express = require('express')
let mainRouter = express.Router()
let db = require('../models/db.js')
let termsAndConditionsController = require('../controllers/termsAndConditionsController')

mainRouter.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'index.html'))
})

mainRouter.get('/about/', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'about.html'))
})

mainRouter.get('/terms_and_conditions', function (req, res) {
  termsAndConditionsController(req, res)
})

mainRouter.get('/database/', function (req, res) {
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
      res.send(result)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

mainRouter.get('/sign-in/', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'sign-in.html'))
})

mainRouter.get('*', function (req, res) {
  res.render('error')
})

module.exports = mainRouter
