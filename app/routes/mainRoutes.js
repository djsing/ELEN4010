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
let invitesModel = require('../models/invitesModel')
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

// ----------------
// RESTFUL Routing
// ----------------
mainRouter.post('/trip/log', function (log, res) {
  logModel.createLog(log, res)
})

mainRouter.post('/trip-manager/log', function (tripId, res) {
  logModel.getLogs(tripId, res)
})

mainRouter.post('/trip/data', function (req, res) {
  tripModel.createDestinationQuery(req, res)
})

mainRouter.post('/trip-manager/data', function (req, res) {
  tripManagerModel.populateTripAndGroupTableQuery(req, res)
})

mainRouter.post('/trip-manager/get-data', function (req, res) {
  tripManagerModel.getTrips(req, res)
})

mainRouter.post('/trip-manager-interface/data', function (req, res) {
  tripManagerModel.getDestinations(req, res)
})

mainRouter.post('/google-auth', (req, res) => {
  authenticate.googleUserAccountDatabaseConnection(req, res)
})

mainRouter.post('/auth', (req, res) => {
  authenticate.userAccountDatabaseConnection(req, res)
})

mainRouter.get('/email', function (req, res) {
  res.sendFile('email.html', { root: req.app.get('views') })
})

// -----------------------------
// Error/Page Not Found Routing
// ------------------------------
mainRouter.get('*', function (req, res) {
  res.sendFile('/404.html', { root: req.app.get('views') })
  // res.status(404).send('404 Error: page not found')
})
// ----------------- Invites ------------------------------

mainRouter.post('/invite', function (req, res) {
  mailManager.sendInvite(req.body.emailAddress, req.body.tripName, req.body.invitee)
  invitesModel.addInvite(res, req.body)
  res.sendStatus(200)
})

mainRouter.post('/invites/data', function (req, res) {
  invitesModel.getInvites(res, req.body.emailAddress)
  // let pendingTrips = [{ 'title': 'Malawi', 'tripID': '000001' }]
  // res.send(pendingTrips)
})

mainRouter.post('/invites/data/accept', (req, res) => {
  invitesModel.handleInvites(req, res, true)
})

mainRouter.post('/invites/data/deny', (req, res) => {
  invitesModel.handleInvites(req, res, false)
})

module.exports = mainRouter
