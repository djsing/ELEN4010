'use strict'

let path = require('path');
let express = require('express');
let mainRouter = express.Router();

mainRouter.get('/', function (req, res) {
    res.send('Hello World, I\'m Node.js')
})

mainRouter.get('/about/', function(req, res) {
    res.sendFile(path.join(__dirname, '../views', 'about.html'))
})

mainRouter.get('*', function(req, res) {
    res.render('error');
  });
  
module.exports = mainRouter