'use strict'
let path = require('path')

module.exports = function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'terms_and_conditions.html'))
}
