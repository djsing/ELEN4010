'use strict'

let express = require('express')
let app = express()
// let path = require('path')
let mainRouter = express.Router()

let bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// let db = require('../models/db.js')
let auth = require('../models/authenticate')
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

mainRouter.get('/trips/data', function (req, res) {
  res.send(tripModel.getTripTitles())
})

mainRouter.post('/trips/data', function (req, res) {
  tripModel.saveTripTitle(req.body.tripTitle)
  res.send(tripModel.getTripTitles())
})

mainRouter.delete('/trips/data', function (req, res) {
  tripModel.removeTrip(req.body.tripTitle)
})

mainRouter.put('/trips/data', function (req, res) {
  tripModel.updateTrip(req.body.oldTripTitle, req.body.newTripTitle)
})

mainRouter.post('/auth', function (req, res) {
  auth.authenticateToken(req)
  res.send('authenticated')
})

mainRouter.get('*', function (req, res) {
  res.status(404).send('404 Error: page not found')
})

module.exports = mainRouter
