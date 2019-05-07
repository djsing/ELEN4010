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
let logModel = require('../models/logModel')
let userModel = require('../models/userModel')

// ------------
// URL Routing
// ------------
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

mainRouter.get(['/trip'], function (req, res) {
  res.sendFile('/trip.html', { root: req.app.get('views') })
})

mainRouter.get('/hotels', function (req, res) {
  res.sendFile('/hotels.html', { root: req.app.get('views') })
})

mainRouter.get(['/trip-manager', '/trips'], function (req, res) {
  res.sendFile('/trip-manager.html', { root: req.app.get('views') })
})

// ----------------
// RESTFUL Routing
// ----------------
mainRouter.post('/trip/log', function (log, res) {
  logModel.createLogQuery(log, res)
})

mainRouter.post('/trip-manager/log', function (tripId, res) {
  logModel.getLogsQuery(tripId, res)
})

mainRouter.post('/trip-manager/user', function (userId, res) {
  userModel.lookUpUser(userId, res)
})

mainRouter.post('/trip/data', function (req, res) {
  tripModel.createDestinationQuery(req, res)
})

mainRouter.post('/trip-manager/data', function (req, res) {
  tripManagerModel.populateTripAndGroupTableQuery(req, res)
})

mainRouter.post('/trip-manager/get-data', function (req, res) {
  tripManagerModel.getTripsQuery(req, res)
})

mainRouter.post('/trip-manager-interface/data', function (req, res) {
  tripManagerModel.getDestinationsQuery(req, res)
})

mainRouter.post('/google-auth', (req, res) => {
  authenticate.googleUserAccountDatabaseConnection(req, res)
})

mainRouter.post('/auth', (req, res) => {
  authenticate.userAccountDatabaseConnection(req, res)
})

// -----------------------------
// Error/Page Not Found Routing
// ------------------------------
mainRouter.get('*', function (req, res) {
  res.status(404).send('404 Error: page not found')
})

module.exports = mainRouter
