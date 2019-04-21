'use strict'

let express = require('express')
let path = require('path')
let app = express()
let mainRouter = require('./app/routes/mainRoutes')

app.set('views', path.join(__dirname, './app/views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, './app/public')))

app.use('/', mainRouter)

let port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
