'use strict'

let express = require('express');
let app = express();
let mainRouter = require('./app/routes/mainRoutes')
app.use('/', mainRouter)
let port_num = 3000
app.listen(process.env.port || port_num)
console.log('Express server running on port', port_num)