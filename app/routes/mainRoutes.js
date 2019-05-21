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
let groupModel = require('../models/groupsModel')

// ------------
// URL Routing
// ------------
mainRouter.get('/', function (req, res) {
  res.status(200).sendFile('/index.html', { root: req.app.get('views') })
})

mainRouter.get('/terms_and_conditions', function (req, res) {
  res.status(200).sendFile('/terms_and_conditions.html', { root: req.app.get('views') })
})

mainRouter.get('/terms_and_conditions/data', function (req, res) {
  res.send(termsModel.getTermsAndCondtions())
})

mainRouter.get('/profile', function (req, res) {
  res.status(200).sendFile('profile.html', { root: req.app.get('views') })
})

mainRouter.get('/about', function (req, res) {
  res.status(200).sendFile('/about.html', { root: req.app.get('views') })
})

mainRouter.get('/register', function (req, res) {
  res.status(200).sendFile('/register.html', { root: req.app.get('views') })
})

mainRouter.get(['/sign-in', '/login', '/signin'], function (req, res) {
  res.status(200).sendFile('/sign-in.html', { root: req.app.get('views') })
})

mainRouter.get(['/trip', '/map'], function (req, res) {
  res.status(200).sendFile('/trip.html', { root: req.app.get('views') })
})

mainRouter.get('/hotels', function (req, res) {
  res.status(200).sendFile('/hotels.html', { root: req.app.get('views') })
})

mainRouter.get(['/trip-manager', '/trips'], function (req, res) {
  res.status(200).sendFile('/trip-manager.html', { root: req.app.get('views') })
})

// ----------------
// RESTFUL Routing
// ----------------
mainRouter.post('/trip/log', function (log, res) {
  res.status(202)
  logModel.createLog(log, res)
})

mainRouter.post('/trip-manager/log', function (tripId, res) {
  res.status(202)
  logModel.getLogs(tripId, res)
})

mainRouter.post('/trip/data', function (req, res) {
  res.status(202)
  tripModel.createDestination(req, res)
})

mainRouter.post('/trip-manager/data', function (req, res) {
  res.status(202)
  tripManagerModel.populateTripAndGroupTable(req, res)
})

mainRouter.post('/trip-manager/get-data', function (req, res) {
  res.status(202)
  tripManagerModel.getTrips(req, res)
})

mainRouter.post('/trip-manager-interface/data', function (req, res) {
  res.status(202)
  tripManagerModel.getDestinations(req, res)
})

mainRouter.post('/google-auth', (req, res) => {
  res.status(202)
  authenticate.googleUserAccountDatabaseConnection(req, res)
})

mainRouter.post('/auth', (req, res) => {
  res.status(202)
  authenticate.userAccountDatabaseConnection(req, res)
})

mainRouter.get('/email', function (req, res) {
  res.status(202)
  res.sendFile('email.html', { root: req.app.get('views') })
})

mainRouter.post('/groups', (req, res) => {
  res.status(202)
  groupModel.returnGroupUsers(req, res)
})

mainRouter.post('/invite', function (req, res) {
  mailManager.sendInvite(req.body.emailAddress, req.body.tripName, req.body.invitee)
  invitesModel.addInvite(res, req.body)
  res.sendStatus(200)
})

mainRouter.post('/invites/data', function (req, res) {
  res.status(202)
  invitesModel.getInvites(res, req.body.emailAddress)
})

mainRouter.post('/invites/data/accept', (req, res) => {
  res.status(202)
  invitesModel.handleInvites(req, res, true)
})

mainRouter.post('/invites/data/deny', (req, res) => {
  res.status(202)
  invitesModel.handleInvites(req, res, false)
})

// -----------------------------
// Error/Page Not Found Routing
// ------------------------------
mainRouter.get('*', function (req, res) {
  res.status(404)
  res.sendFile('/404.html', { root: req.app.get('views') })
  // res.status(404).send('404 Error: page not found')
})

module.exports = mainRouter
