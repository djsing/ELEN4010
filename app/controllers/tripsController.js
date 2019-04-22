'use strict'
// let path = require('path')
let tripTitles = []

module.exports = function (req, res) {
  console.log('tripController happens')
  storeTripTitles(req, res)
}

const storeTripTitles = function (req, res) {
  res.end(JSON.stringify(req.body))
  console.log(req.body)
}
