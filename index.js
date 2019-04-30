'use strict'

let express = require('express')
let path = require('path')
let app = express()
let mainRouter = require('./app/routes/mainRoutes')
require('dotenv').config()
var favicon = require('serve-favicon')
let bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.set('views', path.join(__dirname, './app/views'))
app.use(express.static(path.join(__dirname, './app/public')))
app.use(express.static(path.join(__dirname, './app/controllers')))
app.use(favicon(path.join(__dirname, './app/public/img/favicon.ico')))

app.use('/', mainRouter)

let port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
