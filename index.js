'use strict'

let express = require('express')
let path = require('path')
let app = express()
let mainRouter = require('./app/routes/mainRoutes')
require('dotenv').config()

app.use(express.static(path.join(__dirname, './app/public')))
app.set('views', path.join(__dirname, './app/views'))
app.set('view engine', 'html')

app.use('/', mainRouter)
let port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
