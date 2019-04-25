'use strict'

let express = require('express')
let path = require('path')
let mainRouter = express.Router()
// let db = require('../models/db.js')
let termsModel = require('../models/termsAndConditionsModel')
let tripModel = require('../models/tripModel')

mainRouter.get('/', function (req, res) {
  res.sendFile('/index.html', { root: req.app.get('views') })
})

mainRouter.get('/terms_and_conditions', function (req, res) {
  res.sendFile('/terms_and_conditions.html', { root: req.app.get('views') })
})

mainRouter.get('/terms_and_conditions/data', function (req, res) {
  res.send(termsModel.getTermsAndCondtions())
})

mainRouter.get('/profile', function (req, res) {
  res.sendFile('profile.html', { root: req.app.get('views') })
})

mainRouter.get('/about', function (req, res) {
  res.sendFile('/about.html', { root: req.app.get('views') })
})

mainRouter.get('/register', function (req, res) {
  res.sendFile('/register.html', { root: req.app.get('views') })
})

mainRouter.get('/sign-in', function (req, res) {
  res.sendFile('/sign-in.html', { root: req.app.get('views') })
})

mainRouter.get('/map', function (req, res) {
  res.sendFile('/map.html', { root: req.app.get('views') })
})

mainRouter.get('/hotels', function (req, res) {
  res.sendFile('/hotels.html', { root: req.app.get('views') })
})

mainRouter.get('/trips', function (req, res) {
  res.sendFile('/trips.html', { root: req.app.get('views') })
})

// RESTful interface for Trips page
mainRouter.post('/trips', function (req, res) {
  res.render(path.join(__dirname, '../views', 'trips'))
  let title = req.body.tripTitleInput
  tripModel.saveTripTitle(title)
  res.render(path.join(__dirname, '../views', 'trips'),
    { tripTitleList: tripModel.getTripTitles() })
})
/*
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
*/

mainRouter.get('*', function (req, res) {
  res.status(404).send('404 Error: page not found')
})

module.exports = mainRouter
