'use strict'

let express = require('express')
let app = express()
let mainRouter = express.Router()

let bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

let authenticate = require('../models/authenticate')
let termsModel = require('../models/termsAndConditionsModel')
let tripManagerModel = require('../models/tripManagerModel')
let tripModel = require('../models/tripModel')
let mailManager = require('../models/email_manager')

mainRouter.get('/', function (req, res) {
  res.sendFile('/index.html', { root: req.app.get('views') })
})

mainRouter.get('/terms_and_conditions', function (req, res) {
  res.sendFile('/terms_and_conditions.html', { root: req.app.get('views') })
})

mainRouter.get('/terms_and_conditions/data', function (req, res) {
  res.send(termsModel.getTermsAndCondtions())
})

mainRouter.get('/test', function (req, res) {
  res.sendFile('test.html', { root: req.app.get('views') })
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

mainRouter.get(['/sign-in', '/login', '/signin'], function (req, res) {
  res.sendFile('/sign-in.html', { root: req.app.get('views') })
})

mainRouter.get(['/trip', '/map'], function (req, res) {
  res.sendFile('/trip.html', { root: req.app.get('views') })
})

mainRouter.get('/hotels', function (req, res) {
  res.sendFile('/hotels.html', { root: req.app.get('views') })
})

mainRouter.get(['/trip-manager', '/trips'], function (req, res) {
  res.sendFile('/trip-manager.html', { root: req.app.get('views') })
})

mainRouter.post('/trip/data', function (req, res) {
  res.sendStatus(200)
  tripModel.storeItinerary(req.body.destinationList, res)
})

mainRouter.get('/trip/data', function (req, res) {
  res.send(tripModel.getIntinerary())
})

mainRouter.delete('/trip/data', function (req, res) {
  tripModel.deleteDestination(req.body.destInput, req.body.destName)
  res.sendStatus(200)
})

mainRouter.get(['/trip-manager/data', '/trips/data'], function (req, res) {
  res.send(tripManagerModel.getTripTitles())
})

mainRouter.post(['/trip-manager/data', '/trips/data'], function (req, res) {
  tripManagerModel.saveTripTitle(req.body.tripTitle)
  res.send(tripManagerModel.getTripTitles())
})

mainRouter.delete(['/trip-manager/data', '/trips/data'], function (req, res) {
  tripManagerModel.removeTrip(req.body.tripTitle)
})

mainRouter.put(['/trip-manager/data', '/trips/data'], function (req, res) {
  tripManagerModel.updateTrip(req.body.oldTripTitle, req.body.newTripTitle)
})

mainRouter.post('/google-auth', (req, res) => {
  authenticate.googleUserAccountDatabaseConnection(req, res)
})

mainRouter.post('/auth', (req, res) => {
  authenticate.userAccountDatabaseConnection(req, res)
})

mainRouter.get('*', function (req, res) {
  res.status(404).send('404 Error: page not found')
})

mainRouter.post('/invite', function (req, res) {
  mailManager.sendInvite()
})

module.exports = mainRouter
