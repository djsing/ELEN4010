'use strict'

let express = require('express')
let path = require('path')
let app = express()
let mainRouter = require('./app/routes/mainRoutes')
let cookieSession = require('cookie-session')
let OAuthKeys = require('./app/models/keys.json')
require('dotenv').config()
let bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
  name: 'awaywegosession',
  secret: OAuthKeys.web.client_secret,
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  sameSite: 'strict',
  httpOnly: false
}))

app.set('views', path.join(__dirname, './app/views'))
app.use(express.static(path.join(__dirname, './app/public')))
app.use(express.static(path.join(__dirname, './app/controllers')))

app.use('/', mainRouter)

let port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
